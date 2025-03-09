import { Body, Controller, Post } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { SubscribeMailchimpDto } from './dto/subscribe-mailchimp.dto';

@Controller('integrations/subscribe')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Post()
  subscribe(@Body() createMailchimpDto: SubscribeMailchimpDto) {
    return this.mailchimpService.subscribe(createMailchimpDto);
  }
}
