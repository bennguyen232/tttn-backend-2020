import {inject} from '@loopback/context';
import {Request} from '@loopback/rest';
import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import * as cookie from 'cookie';
import {TokenServiceBindings} from '../../keys';
import {AuthTokenService} from '../services/token.service';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.AUTHENTICATE_TOKEN_SERVICE)
    public tokenService: AuthTokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);

    if (!token) {
      return undefined;
    }

    return this.tokenService.verifyToken(token);
  }

  extractCredentials(request: Request): string | null {
    return this.getJwtFromHeader(request) || this.getJwtFromCookie(request);
  }

  getJwtFromHeader(request: Request): string | null {
    // For example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue || !authHeaderValue.startsWith('Bearer')) {
      return null;
    }

    // Split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      return null;
    }

    return parts[1];
  }

  getJwtFromCookie(request: Request): string | null {
    const cookies = cookie.parse(request.headers.cookie as string);
    return cookies.jwt;
  }
}
