import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as throttler from '@nestjs/throttler'; // Import needed throttler functions
import { LoggingService } from '../../modules/logging/logging.service';

// Throttler middleware is used for requests that are under AuthMiddleware
@Injectable()
export class ThrottlerMiddleware implements NestMiddleware {
  private storage = new throttler.ThrottlerStorageService();
  private ttl = 60000;
  private limit = 10;

  constructor(private readonly logger: LoggingService) {
    this.logger.setContext('ThrottlerMiddleware');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || 'unknown-ip';
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    try {
      const { totalHits } = await this.storage.increment(
        key,
        this.ttl,
        this.limit,
        this.ttl,
        'default',
      );

      res.header('X-RateLimit-Limit', this.limit.toString());
      res.header(
        'X-RateLimit-Remaining',
        Math.max(0, this.limit - totalHits).toString(),
      );

      if (totalHits > this.limit) {
        this.logger.warn(
          `Rate limit exceeded: ${method} ${originalUrl} - IP: ${key} - UserAgent: ${userAgent} - Hits: ${totalHits}/${this.limit}`,
        );

        res.header('Retry-After', (this.ttl / 1000).toString());
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Try again later.',
        });
      }

      next();
    } catch (error) {
      this.logger.error(
        `Error in throttler middleware: ${method} ${originalUrl} - IP: ${key}`,
        error instanceof Error ? error.stack : undefined,
      );
      next(error);
    }
  }
}
