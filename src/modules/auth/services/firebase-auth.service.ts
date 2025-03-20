import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import { UserRole } from '../../users/enums/user-role';
import { CurrentUser } from '../entities/current.user.entity';
import { LinkedinUser } from '../models/linkedin-user';
import { DecodedIdToken, UserRecord } from 'firebase-admin/lib/auth';
import { ServiceAccount } from 'firebase-admin/lib/app/credential';

interface ExtendedDecodedIdToken extends DecodedIdToken {
  app_user_id: string;
  app_user_role: UserRole;
  name: string;
  email: string;
}

@Injectable()
export class FirebaseAuthService {
  private admin: firebaseAdmin.app.App;

  constructor(private configService: ConfigService) {}

  private getAdmin() {
    if (this.admin) {
      return this.admin;
    }
    const config = this.configService.get<ServiceAccount>('firebase');
    this.admin = firebaseAdmin.initializeApp(config);
    return this.admin;
  }

  private getTokenFromHeader(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new UnauthorizedException('Invalid token');
    }
    return match[1];
  }

  async authenticate(authHeader: string): Promise<CurrentUser> {
    const token = this.getTokenFromHeader(authHeader);
    try {
      const decodedToken = (await this.getAdmin()
        .auth()
        .verifyIdToken(token)) as ExtendedDecodedIdToken;
      return {
        id: decodedToken.app_user_id,
        email: decodedToken.email,
        uid: decodedToken.uid,
        name: decodedToken.name,
        role: decodedToken.app_user_role,
      };
    } catch {
      throw new UnauthorizedException('Something went wrong');
    }
  }

  async authenticateWithLinkedin(data: LinkedinUser): Promise<string> {
    let user: UserRecord;
    try {
      user = await this.getAdmin().auth().getUserByEmail(data.email);
    } catch (err) {
      if (err.errorInfo.code !== 'auth/user-not-found') {
        throw new UnauthorizedException('Something went wrong');
      }
      user = await this.getAdmin().auth().createUser({
        email: data.email,
        emailVerified: data.email_verified,
        displayName: data.name,
        photoURL: data.picture,
        uid: data.sub,
      });
    }
    try {
      const customToken = await this.getAdmin()
        .auth()
        .createCustomToken(user.uid);
      return customToken;
    } catch {
      throw new UnauthorizedException('Something went wrong');
    }
  }

  async setCustomUserData(
    uid: string,
    data: {
      app_user_id: string;
      app_user_role: UserRole;
      app_user_active: boolean;
    },
  ): Promise<any> {
    try {
      await this.getAdmin().auth().setCustomUserClaims(uid, data);
      return { message: 'success' };
    } catch {
      throw new UnauthorizedException('Something went wrong');
    }
  }
}
