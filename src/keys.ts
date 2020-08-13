import {BindingKey} from '@loopback/context';
import {UserService} from '@loopback/authentication';
import {RequestHandler} from 'express-serve-static-core';
import {Account, PasswordHasher} from './domain/models/account.model';
import {Credentials} from './infrastructure/repositories';
import {SystemService} from './application/services/system.service';
import {NodeMailerMailService} from './infrastructure/services/nodemailer.service';
import {SecuredJwtService} from './infrastructure/services/securedjwt.service';
import {AuthTokenService} from './application/services/token.service';
import {EnvService} from './infrastructure/services/env.service';
import {MailService} from './application/services/mail.service';
import {HtmlParserService} from './infrastructure/services/htmlparser.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '31560000'; // 1 year
  export const RESET_PASSWORD_TOKEN_EXPIRES_IN_VALUE = '300000'; // 5 minutes
}

export enum Status {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const RESET_PASSWORD_TOKEN_EXPIRES_IN_VALUE = BindingKey.create<
    string
  >('authentication.jwt.reset_password_token_expires.in.seconds');
  export const TOKEN_SERVICE = BindingKey.create<AuthTokenService>(
    'services.authentication.jwt.tokenservice',
  );
  export const AUTHENTICATE_TOKEN_SERVICE = BindingKey.create<AuthTokenService>(
    'services.authentication.jwt.authenticate_token_service',
  );
  export const SECURED_JWT_SERVICE = BindingKey.create<SecuredJwtService>(
    'services.authentication.secured_jwt.secured_jwt_service',
  );
}

export namespace EnvServiceBinding {
  export const ENVIRONMENT_VARIABLE = BindingKey.create<EnvService>(
    'services.env.environment_variable',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace AccountServiceBindings {
  export const ACCOUNT_SERVICE = BindingKey.create<
    UserService<Account, Credentials>
  >('services.account.service');
}

export namespace SystemConfiguration {
  export const FRONTEND_BASE_URL = BindingKey.create<string>(
    'services.system.config.frontend_base_url',
  );
  export const MONGO_DATABASE_URL = BindingKey.create<string>(
    'services.system.config.mongo_database_url',
  );
  //process.env.DATABASE_URL_MONGO || 'mongodb://mongodb/int-backend-loopback4-dev'
  export const SYSTEM_INITIALIZATION_PASSWORD = BindingKey.create<string>(
    'services.system.config.system_initialization_password',
  );
  // process.env.SYSTEM_INITIALIZATION_PASSWORD || '123456789'
  export const BASE_URL = BindingKey.create<string>(
    'services.system.config.base_url',
  );
  // process.env.BASE_URL || 'http://localhost:3000/'
  export const COOKIE_SECRET = BindingKey.create<string>(
    'services.system.config.cookie_secret',
  );
  // process.env.COOKIE_SECRET || 'verySecretString'
  export const ENABLE_API_EXPLORER = BindingKey.create<string>(
    'services.system.config.enable_api_explorer',
  );
  // process.env.ENABLE_API_EXPLORER || 'true'
  export const HOST = BindingKey.create<string>('services.system.config.host');
  // process.env.HOST || '127.0.0.1'
  export const PORT = BindingKey.create<string>('services.system.config.port');
  // process.env.PORT || '3000'
}

export namespace SystemServiceBindings {
  export const SYSTEM_SERVICE = BindingKey.create<SystemService>(
    'services.system.service',
  );
}

export namespace MailServiceBindings {
  export const MAIL_SERVICE = BindingKey.create<NodeMailerMailService>(
    'services.mail.service',
  );
  export const AUTHENTICATE_MAIL_SERVICE = BindingKey.create<MailService>(
    'services.mail.service.authenticate',
  );
  export const HTML_PARSER = BindingKey.create<HtmlParserService>(
    'services.mail.service.html_parser',
  );
}

export namespace AuthorizationBindings {
  export const RBAC_AUTHORIZATION_PROVIDER = 'authorization.casbin.provider';
}

export namespace TaskServiceBindings {
  export const TASK_SERVICE = BindingKey.create('services.task');
}

export type FileUploadHandler = RequestHandler;

export namespace FileUploadServiceBindings {
  export const FILE_UPLOAD_HANDLER = BindingKey.create<FileUploadHandler>(
    'services.FileUpload',
  );
}

export namespace S3ServiceBindings {
  export const S3_SERVICE = BindingKey.create('services.s3');
}

export namespace UtilitiesServiceBindings {
  export const UTILITIES_SERVICE = BindingKey.create('services.utilities');
}
