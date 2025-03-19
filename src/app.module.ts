import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mailchimpConfig from './core/config/mailchimp.config';
import { MailchimpModule } from './integrations/mailchimp/mailchimp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailchimpConfig],
    }),
  TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true, 
      synchronize: true,     
    }),
    MailchimpModule,
    UsersModule,
    ProjectsModule,
    VotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
