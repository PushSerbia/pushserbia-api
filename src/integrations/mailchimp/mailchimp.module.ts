import { Module } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { MailchimpController } from './mailchimp.controller';

@Module({
  controllers: [MailchimpController],
  providers: [MailchimpService],
})
export class MailchimpModule {}
