import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import redisConfig from './core/config/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { LoggingModule } from './modules/logging/logging.module';
import { LoggingMiddleware } from './core/middlewares/logging.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from './core/throttler.guard';
import { ThrottlerMiddleware } from './core/middlewares/throttler.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        mailchimpConfig,
        linkedinConfig,
        firebaseConfig,
        authConfig,
        redisConfig,
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<QueueOptions>('redis');
        if (config) {
          return config;
        }
        throw new Error('Redis connection options are not defined');
      },
      inject: [ConfigService],
    }),
    MailchimpModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    VotesModule,
    LoggingModule,
    // ThrottlerModule is used for requests that are not under AuthMiddleware
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
      errorMessage: 'Too many requests. Try again later.',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const customRoutes = [
      { path: '/users/me', method: RequestMethod.GET },
      { path: '/users/account', method: RequestMethod.GET },
    ];

    consumer.apply(LoggingMiddleware).forRoutes('*');

    consumer
      .apply(ThrottlerMiddleware, AuthMiddleware)
      .exclude(
        { path: '', method: RequestMethod.ALL },
        { path: '/integrations/subscribe', method: RequestMethod.POST },
        { path: '/auth/redirect/linkedin', method: RequestMethod.GET },
        { path: '/projects', method: RequestMethod.GET },
        ...customRoutes,
      )
      .forRoutes('*');

    consumer.apply(ValidTokenOnlyMiddleware).forRoutes(...customRoutes);
  }
}
