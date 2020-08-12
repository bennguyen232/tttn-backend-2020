import {HttpErrors} from '@loopback/rest';
import {UserService as UserAuthenticationService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {inject} from '@loopback/context';
import {
  Credentials,
  AccountRepository,
} from '../../infrastructure/repositories';
import {
  PasswordHasher,
  Role,
  Account,
  UserValidator,
} from '../../domain/models/account.model';
import {
  MailServiceBindings,
  PasswordHasherBindings,
  TokenServiceBindings,
} from '../../keys';
import {Errors} from '../errors';
import {AuthTokenService} from './token.service';
import {MailService} from './mail.service';

export class AccountService
  implements UserAuthenticationService<Account, Credentials> {
  constructor(
    // user repository
    @repository(AccountRepository) public accountRepository: AccountRepository,
    // password hasher repository
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private passwordHasher: PasswordHasher,
    // secured jwt service
    @inject(TokenServiceBindings.AUTHENTICATE_TOKEN_SERVICE)
    private authenticateTokenService: AuthTokenService,
    // mail service for authentication
    @inject(MailServiceBindings.AUTHENTICATE_MAIL_SERVICE)
    private authenticateMailService: MailService,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Account> {
    const foundUser = await this.accountRepository.findOne({
      where: {email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(Errors.INVALID_CREDENTIALS_EMAIL);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(Errors.INVALID_CREDENTIALS_EMAIL);
    }

    return foundUser;
  }

  async createAdmin(credentials: Credentials): Promise<Account> {
    return this.createUser({
      ...credentials,
      role: Role.ROOT_ADMIN,
    });
  }

  convertToUserProfile(user: Account): UserProfile {
    return {[securityId]: user.id, name: ''};
  }

  private async generatePasswordResetLink(user: Account): Promise<string> {
    // what to do:
    // sign token with user secret code
    // (which is password hash + createdAt),
    // hashing the userId and the token will expires in 3 minutes
    return this.authenticateTokenService
      .generateResetPasswordToken(user)
      .catch(() => {
        throw new HttpErrors.BadRequest('generate_password_reset_link_failed');
      });
  }

  async sendResetPasswordLink(email: string): Promise<void> {
    const existingUser = await this.accountRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser === null) {
      throw new HttpErrors.NotFound('user_not_existed');
    }

    const token = await this.generatePasswordResetLink(existingUser);

    try {
      await this.authenticateMailService.sendResetPasswordEmail(
        existingUser,
        token,
      );
    } catch (e) {
      throw new HttpErrors.BadRequest('send_email_reset_password_failed');
    }
  }

  async changeUserPassword(
    currentUserProfile: UserProfile,
    changePasswordPayload: {
      newPassword: string;
      oldPassword: string;
    },
  ): Promise<void> {
    const user = await this.getUserFromProfile(currentUserProfile);

    if (!user) {
      throw new HttpErrors.NotFound('user_not_existed');
    }

    const {oldPassword, newPassword} = changePasswordPayload;

    const passwordMatched = await this.passwordHasher.comparePassword(
      oldPassword,
      user.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(Errors.INVALID_CREDENTIALS_EMAIL);
    }

    try {
      const passwordHash: string = await this.passwordHasher.hashPassword(
        newPassword,
      );
      await this.accountRepository.updateById(user.id, {
        ...user,
        password: passwordHash,
        authPayloadHash: this.authenticateTokenService.generatePasswordHash(
          passwordHash,
        ),
      });
    } catch (e) {
      throw new HttpErrors.BadRequest('updated_user_password_failed');
    }
  }

  async resetUserPassword(changePasswordPayload: {
    resetPasswordToken: string;
    newPassword: string;
  }): Promise<void> {
    const {newPassword, resetPasswordToken} = changePasswordPayload;

    const userProfile: UserProfile = await this.authenticateTokenService.verifyToken(
      resetPasswordToken,
    );

    if (!UserValidator.isValidPassword(newPassword)) {
      throw new HttpErrors.BadRequest('password_invalid');
    }

    const currentUser: Account | null = await this.accountRepository.findOne({
      where: {
        email: userProfile.email,
      },
    });

    if (!currentUser) {
      throw new HttpErrors.NotFound('user_not_existed');
    }
    try {
      const passwordHash: string = await this.passwordHasher.hashPassword(
        newPassword,
      );
      await this.accountRepository.updateById(currentUser.id, {
        ...currentUser,
        password: passwordHash,
        authPayloadHash: this.authenticateTokenService.generatePasswordHash(
          passwordHash,
        ),
      });
    } catch (e) {
      throw new HttpErrors.BadRequest('updated_user_password_failed');
    }
  }

  async getUserFromProfile(userProfile: UserProfile): Promise<Account> {
    userProfile.id = userProfile[securityId];

    const existingUser = await this.accountRepository.findById(userProfile.id);

    if (!existingUser) {
      throw new HttpErrors.NotFound('user_not_existed');
    }

    return existingUser;
  }

  private generateVerifyAccountToken(user: Account): Promise<string> {
    return this.authenticateTokenService.generateVerifyAccountToken(user);
  }

  async verifyUser(user: Account): Promise<void> {
    if (user === null) {
      throw new HttpErrors.NotFound('user_not_existed');
    }

    if (user.emailVerified) {
      throw new HttpErrors.BadRequest('user_status_already_verified');
    }

    try {
      await this.accountRepository.updateById(user.id, {
        ...user,
        emailVerified: true,
      });
    } catch (e) {
      throw new HttpErrors.BadRequest('verify_user_failed');
    }
  }

  async sendVerifyAccountEmail(user: Account): Promise<void> {
    if (user === null) {
      throw new HttpErrors.NotFound('user_not_existed');
    }

    if (user.emailVerified) {
      throw new HttpErrors.BadRequest('user_status_is_not_inactive');
    }

    const token = await this.generateVerifyAccountToken(user);

    try {
      await this.authenticateMailService.sendVerifyAccountEmail(user, token);
    } catch (e) {
      throw new HttpErrors.BadRequest('send_verify_account_email_failed');
    }
  }

  async createUser(user: {
    lastName?: string;
    firstName?: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<Account> {
    const existingUser = await this.accountRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new HttpErrors.Conflict('user_existed');
    }

    this.validateUserCredentials(user);

    const createdUser = await this.accountRepository.create({
      ...user,
      password: await this.passwordHasher.hashPassword(user.password),
    });

    // send email verify
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.sendVerifyAccountEmail(createdUser);

    return createdUser;
  }

  private validateUserCredentials(credentials: Credentials) {
    if (!UserValidator.isValidEmail(credentials.email)) {
      throw new HttpErrors.UnprocessableEntity('invalid_email');
    }

    if (!UserValidator.isValidPassword(credentials.password)) {
      throw new HttpErrors.UnprocessableEntity('invalid_password');
    }
  }
}
