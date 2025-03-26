import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import mailchimpConfig from './core/config/mailchimp.config';
import { MailchimpModule } from './integrations/mailchimp/mailchimp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { VotesModule } from './modules/votes/votes.module';
import { AuthModule } from './modules/auth/auth.module';
import linkedinConfig from './core/config/linkedin.config';
import firebaseConfig from './core/config/firebase.config';
import { AuthMiddleware } from './modules/auth/middlewares/auth.middleware';
import { ValidTokenOnlyMiddleware } from './modules/auth/middlewares/valid-token-only/valid-token-only.middleware';
import authConfig from './core/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailchimpConfig, linkedinConfig, firebaseConfig, authConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailchimpModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '', method: RequestMethod.ALL },
        { path: '/integrations/subscribe', method: RequestMethod.POST },
        { path: '/auth/redirect/linkedin', method: RequestMethod.GET },
        { path: '/users/me', method: RequestMethod.GET }, // custom middleware is added below instead
        { path: '/users/account', method: RequestMethod.GET }, // custom middleware is added below instead
      )
      .forRoutes('*');

    consumer.apply(ValidTokenOnlyMiddleware).forRoutes('/users/me');
    consumer.apply(ValidTokenOnlyMiddleware).forRoutes('/users/account');
  }
}
