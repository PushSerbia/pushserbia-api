import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Request, Response } from 'express';

@Injectable()
export class ValidTokenOnlyMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseAuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { __auth } = req.cookies;
      if (!__auth) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'invalid token' });
      }

      req['user'] = await this.firebaseService.authenticate(__auth);

      next();
    } catch {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'invalid token' });
    }
  }
}
