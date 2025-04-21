import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// AppThrottlerGuard is used for requests that are not under AuthMiddleware
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {}
