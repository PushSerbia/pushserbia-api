import { SubscribeMailchimpDto } from './dto/subscribe-mailchimp.dto';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailchimpConfig } from '../../core/config/mailchimp.config';
import Mailchimp from 'mailchimp-api-v3';

interface MailchimpBody {
  tags?: string[];
  email_address: string;
  status: string;
  merge_fields?: {
    FNAME?: string;
    PHONE?: string;
    MESSAGE?: string;
  };
}

@Injectable()
export class MailchimpService {
  private config: MailchimpConfig;
  private mailchimp: Mailchimp;

  constructor(private configService: ConfigService) {}

  getConfig(): MailchimpConfig {
    if (this.config) {
      return this.config;
    }
    const config = this.configService.get<MailchimpConfig>('mailchimp');
    if (!config?.enabled) {
      console.error('Mailchimp: Service is disabled.');
      throw new HttpException('Service is disabled', HttpStatus.BAD_REQUEST);
    }
    if (!config.token) {
      console.error('Mailchimp: Token is not defined.');
      throw new HttpException('Service is disabled', HttpStatus.BAD_REQUEST);
    }
    this.config = config;
    return this.config;
  }

  getMailchimp(): Mailchimp {
    if (this.mailchimp) {
      return this.mailchimp;
    }

    const mailchimpRef = require('mailchimp-api-v3');

    this.mailchimp = new mailchimpRef(this.getConfig().token) as Mailchimp;

    return this.mailchimp;
  }

  async subscribe(createMailchimpDto: SubscribeMailchimpDto) {
    const fetchResponse = await this.getMailchimp().request({
      method: 'get',
      path: '/lists',
    });
    const { lists, total_items, statusCode } = fetchResponse;
    if (!total_items) {
      console.error('Mailchimp: There is no defined mailing list.');
      throw new HttpException('Service is disabled', HttpStatus.BAD_REQUEST);
    }
    if (statusCode !== 200) {
      console.error(
        'Mailchimp: Something went wrong during the fetching mailing lists.',
      );
      throw new HttpException('Service is disabled', HttpStatus.BAD_REQUEST);
    }

    let activeList = lists.find(
      (list: any) => list.stats.member_count < this.getConfig().limit,
    );
    if (!activeList) {
      console.warn('Mailchimp: Every mailing list is full.');
      // todo: think about creating the new list or increase budget plan
      activeList = lists[lists.length - 1];
    }

    const body: MailchimpBody = {
      email_address: createMailchimpDto.email,
      status: 'subscribed',
    };
    const { tags, name, phone, message } = createMailchimpDto;
    if (tags) {
      body.tags = [tags];
    }
    if (name) {
      body.merge_fields = { FNAME: name };
    }
    if (phone) {
      body.merge_fields = { ...(body.merge_fields || {}), PHONE: phone };
    }
    if (message) {
      body.merge_fields = { ...(body.merge_fields || {}), MESSAGE: message };
    }

    try {
      await this.getMailchimp().request({
        method: 'post',
        path: `/lists/${activeList.id}/members`,
        body,
      });

      return;
    } catch (e) {
      console.error(
        'Mailchimp: Something went wrong during the creating subscriber.',
      );
      console.log(e);
      if (e.statusCode === 400 && e.title === 'Member Exists') {
        // silently ignore when member already exists
        return;
      }
      throw new HttpException('Something is wrong.', HttpStatus.BAD_REQUEST);
    }
  }
}
