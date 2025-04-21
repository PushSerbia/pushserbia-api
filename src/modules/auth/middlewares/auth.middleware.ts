import { Injectable, NestMiddleware } from '@nestjs/common';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { LoggingService } from '../../../modules/logging/logging.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly firebaseService: FirebaseAuthService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('AuthMiddleware');
  }

  async use(req: any, res: any, next: () => void) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    try {
      const { authorization } = req.headers;
      if (!authorization) {
        this.logger.warn(
          `Unauthorized request [no token]: ${method} ${originalUrl} - ${ip} ${userAgent}`,
        );
        return res.status(401).json({ message: 'invalid token' });
      }

      const user = await this.firebaseService.authenticate(authorization);
      if (!user.id && req.baseUrl !== '/v1/users/account') {
        this.logger.warn(
          `Invalid user ID: ${method} ${originalUrl} - ${ip} ${userAgent}`,
        );
        return res.status(409).json({ message: 'invalid id' });
      }

      req.user = user;

      next();
    } catch (err) {
      this.logger.warn(
        `Unauthorized request [invalid token]: ${method} ${originalUrl} - ${ip} ${userAgent}`,
      );
      return res.status(401).json({ message: 'invalid token' });
    }
  }
}
