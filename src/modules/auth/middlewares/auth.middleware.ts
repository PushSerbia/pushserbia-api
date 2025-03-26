import { Injectable, NestMiddleware } from '@nestjs/common';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseAuthService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ message: 'invalid token' });
      }

      const user = await this.firebaseService.authenticate(authorization);
      if (!user.id && req.baseUrl !== '/v1/users/account') {
        return res.status(409).json({ message: 'invalid id' });
      }

      req.user = user;

      next();
    } catch (err) {
      return res.status(401).json({ message: 'invalid token' });
    }
  }
}
