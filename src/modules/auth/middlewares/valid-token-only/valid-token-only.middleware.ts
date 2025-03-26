import { Injectable, NestMiddleware } from '@nestjs/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Injectable()
export class ValidTokenOnlyMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseAuthService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ message: 'invalid token' });
      }

      req.user = await this.firebaseService.authenticate(authorization);

      next();
    } catch (err) {
      return res.status(401).json({ message: 'invalid token' });
    }
  }
}
