import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/services/auth.service';

@Injectable()
export class CallbackPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  transform(callbackUrl: string | undefined): any {
    return this.isValid(callbackUrl) ? callbackUrl : null;
  }

  private isValid(callbackUrl: string | undefined): boolean {
    if (!callbackUrl) {
      return false;
    }

    const config = this.authService.getConfig();

    return config.callbackUrls.includes(callbackUrl);
  }
}
