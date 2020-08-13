import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {
  AuthorizationComponent,
  AuthorizationTags,
} from '@loopback/authorization';
import * as multer from 'multer';

import {BcryptPasswordHasher} from './infrastructure/services/bcrypt-password-hasher.service';
import {AccountService} from './application/services/account.service';
import {ApplicationSequence} from './sequence';
import {JWTAuthenticationStrategy} from './application/authentication/jwt-strategy';
import {
  AuthorizationBindings,
  EnvServiceBinding,
  MailServiceBindings,
  PasswordHasherBindings,
  SystemServiceBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  AccountServiceBindings,
  SystemConfiguration,
  TaskServiceBindings,
  FileUploadServiceBindings,
  S3ServiceBindings,
  UtilitiesServiceBindings,
} from './keys';
import {SystemService} from './application/services/system.service';
import {RbacAuthorizationProvider} from './application/services/authorizer';
import {NodeMailerMailService} from './infrastructure/services/nodemailer.service';
import {SecuredJwtService} from './infrastructure/services/securedjwt.service';
import {EnvService} from './infrastructure/services/env.service';
import {AuthTokenService} from './application/services/token.service';
import {MailService} from './application/services/mail.service';
import {HtmlParserService} from './infrastructure/services/htmlparser.service';
import {TaskService} from './application/services/task.service';
import {S3Service} from './application/services/s3.service';
import {UtilitiesService} from './infrastructure/services/utilities.service';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: {title: pkg.name, version: pkg.version},
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{bearerAuth: []}],
      servers: [{url: '/'}],
    });

    this.setUpBindings();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.component(AuthorizationComponent);

    this.sequence(ApplicationSequence);

    // Swagger rest APIs explorer
    this.bind(RestExplorerBindings.CONFIG).to({path: '/explorer'});
    this.component(RestExplorerComponent);

    // Configure file upload with multer options
    this.configureFileUpload();

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        glob: '/application/controllers/**/*.controller.js',
      },
      repositories: {
        glob: '/infrastructure/repositories/**/*.repository.js',
      },
      datasources: {
        glob: '/infrastructure/datasources/**/*.datasource.js',
      },
      services: {
        glob: '/@(application|infrastructure)/services/**/*.js',
      },
    };
  }

  setUpBindings(): void {
    // Bind package.json to the application context.
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE.toString(),
    );

    this.bind(TokenServiceBindings.RESET_PASSWORD_TOKEN_EXPIRES_IN_VALUE).to(
      TokenServiceConstants.RESET_PASSWORD_TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.SECURED_JWT_SERVICE).toClass(
      SecuredJwtService,
    );

    this.bind(TokenServiceBindings.AUTHENTICATE_TOKEN_SERVICE).toClass(
      AuthTokenService,
    );

    this.bind(EnvServiceBinding.ENVIRONMENT_VARIABLE).toClass(EnvService);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(
      BcryptPasswordHasher,
    );

    this.bind(AccountServiceBindings.ACCOUNT_SERVICE).toClass(AccountService);

    this.bind(MailServiceBindings.MAIL_SERVICE).toClass(NodeMailerMailService);
    this.bind(MailServiceBindings.AUTHENTICATE_MAIL_SERVICE).toClass(
      MailService,
    );
    this.bind(MailServiceBindings.HTML_PARSER).toClass(HtmlParserService);

    this.bind(SystemServiceBindings.SYSTEM_SERVICE).toClass(SystemService);

    // environment binding
    this.bind(SystemConfiguration.FRONTEND_BASE_URL).to(
      process.env.FRONTEND_BASE_URL || 'http://localhost:3001/',
    );

    this.bind(SystemConfiguration.BASE_URL).to(
      process.env.BASE_URL || 'http://localhost:3000/',
    );

    this.bind(SystemConfiguration.MONGO_DATABASE_URL).to(
      process.env.MONGO_DATABASE_URL || 'mongodb://mongodb/database-dev',
    );

    this.bind(SystemConfiguration.SYSTEM_INITIALIZATION_PASSWORD).to(
      process.env.SYSTEM_INITIALIZATION_PASSWORD || '123456789',
    );

    this.bind(SystemConfiguration.COOKIE_SECRET).to(
      process.env.COOKIE_SECRET || 'verySecretString',
    );

    this.bind(SystemConfiguration.ENABLE_API_EXPLORER).to(
      process.env.ENABLE_API_EXPLORER || 'true',
    );

    this.bind(SystemConfiguration.HOST).to(process.env.HOST || '127.0.0.1');

    this.bind(SystemConfiguration.PORT).to(process.env.PORT || '3000');

    this.bind(AuthorizationBindings.RBAC_AUTHORIZATION_PROVIDER)
      .toProvider(RbacAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    this.bind(TaskServiceBindings.TASK_SERVICE).toClass(TaskService);

    this.bind(S3ServiceBindings.S3_SERVICE).toClass(S3Service);

    this.bind(UtilitiesServiceBindings.UTILITIES_SERVICE).toClass(
      UtilitiesService,
    );
  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload() {
    const multerOptions: multer.Options = {
      storage: multer.memoryStorage(),
    };
    // Configure the file upload service with multer options
    this.configure(FileUploadServiceBindings.FILE_UPLOAD_HANDLER).to(
      multerOptions,
    );
  }
}
