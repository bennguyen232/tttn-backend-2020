import {Entity, model, property} from '@loopback/repository';

export namespace SystemStatus {
  export const INITIALIZED = 'INITIALIZED';
}

export type SystemStatusData = {
  status: string;
};

export type MailSmtpSettings = {
  password: string;
  smtpHost: string;
  username: string;
  smtpPort: string;
  senderEmail: string;
  senderName: string;
};

export type ResetPasswordSettings = {
  emailTemplate: string;
  subject: string;
  senderEmail: string;
  senderName: string;
};

export type VerifyAccountSetting = {
  emailTemplate: string;
  subject: string;
  senderEmail: string;
  senderName: string;
};

export type ConfigurationData =
  | SystemStatusData
  | MailSmtpSettings
  | ResetPasswordSettings
  | VerifyAccountSetting;

export enum ConfigurationKey {
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  MAIL_SMTP_SETTINGS = 'MAIL_SMTP_SETTINGS',
  RESET_PASSWORD_SETTINGS = 'RESET_PASSWORD_SETTINGS',
  VERIFY_ACCOUNT_SETTINGS = 'VERIFY_ACCOUNT_SETTINGS',
}

@model({settings: {strict: false, idInjection: false}})
export class Configuration extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    jsonSchema: {
      enum: [
        ConfigurationKey.SYSTEM_STATUS,
        ConfigurationKey.MAIL_SMTP_SETTINGS,
        ConfigurationKey.RESET_PASSWORD_SETTINGS,
        ConfigurationKey.VERIFY_ACCOUNT_SETTINGS,
      ],
    },
  })
  id: ConfigurationKey;

  @property({
    type: 'object',
  })
  data: ConfigurationData;

  constructor(data: Configuration) {
    super(data);
  }
}
