import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import mailchimpConfig from './core/config/mailchimp.config';
import { MailchimpModule } from './integrations/mailchimp/mailchimp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailchimpConfig],
    }),
    MailchimpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
