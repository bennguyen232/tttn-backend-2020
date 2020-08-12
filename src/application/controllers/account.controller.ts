import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  del,
  patch,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  put,
  requestBody,
  HttpErrors,
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {
  authorize,
  AUTHENTICATED,
  UNAUTHENTICATED,
} from '@loopback/authorization';
import {
  Role,
  Account,
  AccountConstraint,
  PasswordHasher,
} from '../../domain/models/account.model';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  AccountServiceBindings,
  MailServiceBindings,
  S3ServiceBindings,
} from '../../keys';
import {
  Credentials,
  UserError,
  AccountRepository,
} from '../../infrastructure/repositories';
import {NodeMailerMailService} from '../../infrastructure/services/nodemailer.service';
import {AccountService} from '../services/account.service';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {AuthTokenService} from '../services/token.service';
import {S3Service} from '../services/s3.service';

export class AccountController {
  constructor(
    @repository(AccountRepository)
    private accountRepository: AccountRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private passwordHasher: PasswordHasher,

    @inject(TokenServiceBindings.AUTHENTICATE_TOKEN_SERVICE)
    private authenticateTokenService: AuthTokenService,

    @inject(AccountServiceBindings.ACCOUNT_SERVICE)
    private accountService: AccountService,

    @inject(MailServiceBindings.MAIL_SERVICE)
    private mailService: NodeMailerMailService,

    @inject(SecurityBindings.USER, {optional: true})
    private currentAuthUserProfile: UserProfile,

    @inject(RestBindings.Http.RESPONSE)
    private response: Response,

    @inject(S3ServiceBindings.S3_SERVICE)
    private s3Service: S3Service,
  ) {}

  @post('/accounts', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Account)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {exclude: ['id']}),
        },
      },
    })
    user: Omit<Account, 'id'>,
  ): Promise<Account> {
    const userWithExistingEmail = await this.accountRepository.findOne({
      where: {email: user.email},
    });

    if (userWithExistingEmail) {
      throw new HttpErrors.BadRequest(UserError.EMAIL_EXISTED);
    }

    user.password = await this.passwordHasher.hashPassword(user.password);
    return this.accountRepository.create(user);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  @get('/accounts/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Account))
    where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.count(where);
  }

  @get('/accounts', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async find(
    @param.query.object('filter', getFilterSchemaFor(Account))
    filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.accountRepository.find(filter);
  }

  @patch('/accounts', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    user: Account,
    @param.query.object('where', getWhereSchemaFor(Account))
    where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.updateAll(user, where);
  }

  @get('/accounts/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Account)},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async findById(@param.path.string('id') id: string): Promise<Account> {
    return this.accountRepository.findById(
      id === 'me' ? this.currentAuthUserProfile[securityId] : id,
    );
  }

  @patch('/accounts/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    user: Account,
  ): Promise<void> {
    await this.accountRepository.updateById(id, user);
  }

  @put('/accounts/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: Account,
  ): Promise<void> {
    await this.accountRepository.replaceById(id, user);
  }

  @del('/accounts/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.accountRepository.deleteById(id);
  }

  @post('/accounts/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: AccountConstraint.PASSWORD_MIN_LENGTH,
                maxLength: AccountConstraint.PASSWORD_MAX_LENGTH,
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    // Ensure the user exists, and the password is correct
    const user = await this.accountService.verifyCredentials(credentials);

    // Convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.accountService.convertToUserProfile(user);

    // Create a JSON Web Token based on the user profile
    const token = await this.authenticateTokenService.generateToken(
      userProfile,
    );

    return {token};
  }

  @post('/accounts/signup', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              firstName: {
                type: 'string',
                maxLength: AccountConstraint.PARTIAL_NAME_MAX_LENGTH,
              },
              lastName: {
                type: 'string',
                maxLength: AccountConstraint.PARTIAL_NAME_MAX_LENGTH,
              },
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: AccountConstraint.PASSWORD_MIN_LENGTH,
                maxLength: AccountConstraint.PASSWORD_MAX_LENGTH,
              },
            },
          },
        },
      },
    })
    body: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ): Promise<Account> {
    return this.accountService.createUser({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      role: Role.USER,
    });
  }

  @post('/accounts/send-email-reset-password', {
    responses: {
      '204': {
        description:
          'The response should be empty. In the client should reload the page when the request is done.',
      },
      '404': {
        description: "User's email not found",
      },
      '400': {
        description:
          'System cannot generate reset password token or cannot send reset password email',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [UNAUTHENTICATED]})
  async sendEmailResetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    })
    body: {
      email: string;
    },
  ): Promise<void> {
    const {email} = body;
    return this.accountService.sendResetPasswordLink(email);
  }

  @post('/accounts/reset-password', {
    responses: {
      '204': {
        description:
          'The response should be empty. Reset password successfully.',
      },
      '404': {
        description: 'User not found',
      },
      '400': {
        description: 'Cannot perform update password at Db Layer',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [UNAUTHENTICATED]})
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['newPassword', 'resetPasswordToken'],
            properties: {
              newPassword: {
                type: 'string',
                minLength: AccountConstraint.PASSWORD_MIN_LENGTH,
                maxLength: AccountConstraint.PASSWORD_MAX_LENGTH,
              },
              resetPasswordToken: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: {
      newPassword: string;
      resetPasswordToken: string;
    },
  ): Promise<void> {
    return this.accountService.resetUserPassword(body);
  }

  @post('/accounts/change-password', {
    responses: {
      '204': {
        description:
          'The response should be empty. Change password successfully.',
      },
      '404': {
        description: 'User not found',
      },
      '400': {
        description: 'Cannot perform update password at Db Layer',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['oldPassword', 'newPassword'],
            properties: {
              oldPassword: {
                type: 'string',
                minLength: AccountConstraint.PASSWORD_MIN_LENGTH,
                maxLength: AccountConstraint.PASSWORD_MAX_LENGTH,
              },
              newPassword: {
                type: 'string',
                minLength: AccountConstraint.PASSWORD_MIN_LENGTH,
                maxLength: AccountConstraint.PASSWORD_MAX_LENGTH,
              },
            },
          },
        },
      },
    })
    body: {
      newPassword: string;
      oldPassword: string;
    },
  ): Promise<void> {
    // console.log(body);
    return this.accountService.changeUserPassword(
      this.currentAuthUserProfile,
      body,
    );
  }

  @post('/accounts/verify', {
    responses: {
      '204': {
        description: 'The response should be empty. Verify successfully.',
      },
      '404': {
        description: 'User not found',
      },
      '400': {
        description: 'JWT invalid',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async verifyUser(): Promise<void> {
    const currentUser = await this.accountService.getUserFromProfile(
      this.currentAuthUserProfile,
    );
    return this.accountService.verifyUser(currentUser);
  }

  @post('accounts/send-email-verify', {
    responses: {
      '204': {
        description:
          'The response should be empty. Send email verification successfully.',
      },
      '404': {
        description: 'User not found',
      },
      '400': {
        description: 'JWT invalid',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async sendEmailVerify(): Promise<void> {
    const currentUser = await this.accountService.getUserFromProfile(
      this.currentAuthUserProfile,
    );
    return this.accountService.sendVerifyAccountEmail(currentUser);
  }

  @post('accounts/tokens/verify', {
    responses: {
      '200': {
        description: 'Return user object.',
      },
      '401': {
        description: 'User not found',
      },
      '400': {
        description: 'JWT token is not valid',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async verifyToken(): Promise<Account> {
    return this.accountService.getUserFromProfile(this.currentAuthUserProfile);
  }

  @post('accounts/tokens/refresh', {
    responses: {
      '200': {
        description: 'Return user object.',
      },
      '401': {
        description: 'User not found',
      },
      '400': {
        description: 'JWT token is not valid',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async refreshToken(): Promise<{token: string}> {
    const token = await this.authenticateTokenService.refreshToken(
      this.currentAuthUserProfile,
    );
    return {token};
  }

  @post('/accounts/upload-image', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async uploadImage(
    @requestBody.file({
      required: true,
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return this.s3Service.uploadToFolder(request, response, 'avatars');
  }
}
