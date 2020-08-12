import {inject} from '@loopback/context';
import {TokenService} from '@loopback/authentication';
import {HttpErrors} from '@loopback/rest/dist';
import {repository} from '@loopback/repository';
import {UserProfile, securityId} from '@loopback/security';
import {SecuredJwtService} from '../../infrastructure/services/securedjwt.service';
import {TokenServiceBindings} from '../../keys';
import {Account} from '../../domain/models/account.model';
import {AccountRepository} from '../../infrastructure/repositories';
import {Errors} from '../errors';

export enum AuthTokenScope {
  ResetPassword = 'Token::ResetPassword',
  Login = 'Token::Login',
  VerifyAccount = 'Token::VerifyAccount',
}

export const AuthScopeConfigMap: AuthScopeConfig = {
  [AuthTokenScope.Login]: {
    scope: AuthTokenScope.Login,
    expiresIn: '31536000',
  },
  [AuthTokenScope.ResetPassword]: {
    scope: AuthTokenScope.ResetPassword,
    expiresIn: '180000',
  },
  [AuthTokenScope.VerifyAccount]: {
    scope: AuthTokenScope.VerifyAccount,
    expiresIn: '180000',
  },
};

export type AuthTokenScopeConfig = {
  scope: string;
  expiresIn: string;
};

export type AuthScopeConfig = {
  [key in AuthTokenScope]: AuthTokenScopeConfig;
};

export type AuthTokenPayload = {
  userId: string;
  scope: string;
  email: string;
  authPayloadHash: string;
};

export class AuthTokenService implements TokenService {
  constructor(
    // token provider
    @inject(TokenServiceBindings.SECURED_JWT_SERVICE)
    private securedJwtService: SecuredJwtService,

    // inject token secret
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,

    // inject user repo
    @repository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}

  private async updatePayloadHash(
    user: Account,
    authPayloadHash: string,
  ): Promise<void> {
    // console.log('----- inside update auth payload -----');
    // console.log('user.authPayloadHash', user.authPayloadHash);
    // console.log('authPayloadHash', authPayloadHash);

    return this.accountRepository.updateById(user.id, {
      ...user,
      authPayloadHash,
    });
  }

  private async createToken(
    user: Account,
    scope: AuthTokenScope,
    flushOldSession: boolean,
  ): Promise<string> {
    // flush old session means:
    // when re-generate token (change password, generate reset password link, re-login)
    // we will decide whether old sessions are terminated or not (flush old sessions can cause all sessions terminated
    // and users will have to login again)
    // in case we don't want to flush old session, set flushOldSession = false
    // otherwise, set flushOldSession = true
    // note: the session of the token is created regardless the scope
    const authPayloadHash =
      !user.authPayloadHash || flushOldSession
        ? this.generatePasswordHash(user.password)
        : user.authPayloadHash;

    const tokenScopeConfiguration: AuthTokenScopeConfig =
      AuthScopeConfigMap[scope] || AuthScopeConfigMap[AuthTokenScope.Login]; // fallback

    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      scope: tokenScopeConfiguration.scope,
      email: user.email,
      authPayloadHash,
    };

    const token = await this.securedJwtService.signAsync(
      tokenPayload,
      this.jwtSecret,
      {
        expiresIn: tokenScopeConfiguration.expiresIn,
      },
    );

    if (!user.authPayloadHash || flushOldSession)
      await this.updatePayloadHash(user, authPayloadHash);

    return token;
  }

  public generatePasswordHash(userPasswordHash: string): string {
    const issueAt = new Date().getTime();
    return `${userPasswordHash} - ${issueAt}`;
  }

  async refreshToken(userProfile: UserProfile): Promise<string> {
    const user: Account = await this.accountRepository.findById(
      userProfile[securityId],
    );
    return this.createToken(user, AuthTokenScope.Login, true);
  }

  async generateVerifyAccountToken(user: Account): Promise<string> {
    return this.createToken(user, AuthTokenScope.VerifyAccount, true);
  }

  async generateResetPasswordToken(user: Account): Promise<string> {
    return this.createToken(user, AuthTokenScope.ResetPassword, true);
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    // this method is used default when user perform login
    if (!userProfile) {
      console.error('Error generating token : userProfile is null');
      throw new HttpErrors.Unauthorized(Errors.UNKNOWN);
    }

    const user: Account = await this.accountRepository.findById(
      userProfile[securityId],
    );

    try {
      return this.createToken(user, AuthTokenScope.Login, false);
    } catch (error) {
      console.error('Failed to encode JWT token');
      throw new HttpErrors.Unauthorized(Errors.UNKNOWN);
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      console.error(`Error verifying token : 'token' is null`);
      throw new HttpErrors.Unauthorized();
    }

    let userProfile: UserProfile | null;

    try {
      // decode token
      const decodedPayload: AuthTokenPayload = (await this.securedJwtService.verifyAsync(
        token,
        this.jwtSecret,
      )) as AuthTokenPayload;

      // retrieve hash
      const user: Account | null = await this.accountRepository.findById(
        decodedPayload.userId,
      );

      if (!user) {
        throw new HttpErrors.NotFound('user_not_existed');
      }

      // compare hash payload
      const tokenValid =
        user.authPayloadHash === decodedPayload.authPayloadHash;

      if (!tokenValid) throw new Error();

      // payload is valid ==> return user profile
      userProfile = Object.assign(
        {[securityId]: '', name: '', email: ''},
        {[securityId]: user.id, name: '', email: user.email},
      );
    } catch (error) {
      console.error(`Error verifying token : ${error.message}`);
      throw new HttpErrors.Unauthorized();
    }

    return userProfile;
  }
}
