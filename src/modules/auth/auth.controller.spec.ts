import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = {
      redirectionHandler: jest.fn(),
      getConfig: jest.fn().mockReturnValue({
        isSecureCookie: false,
      }),
    } as any;
    controller = new AuthController(authService);
  });

  describe('linkedinRedirect', () => {
    it('should redirect with status and url from authService', async () => {
      authService.redirectionHandler.mockResolvedValue({
        status: HttpStatus.FOUND,
        url: 'https://example.com/account?customToken=abc',
      });

      const mockRes = { redirect: jest.fn() } as any;

      await controller.linkedinRedirect('code', 'http://localhost', mockRes);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        HttpStatus.FOUND,
        'https://example.com/account?customToken=abc',
      );
    });
  });

  describe('setTokenCookie', () => {
    it('should set cookie when token is provided', () => {
      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockReq = {} as any;

      controller.setTokenCookie(mockReq, mockRes, 'my-token');

      expect(mockRes.cookie).toHaveBeenCalledWith(
        '__auth',
        'my-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should clear cookie when token is empty', () => {
      const mockRes = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockReq = {} as any;

      controller.setTokenCookie(mockReq, mockRes, '');

      expect(mockRes.clearCookie).toHaveBeenCalledWith('__auth');
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
