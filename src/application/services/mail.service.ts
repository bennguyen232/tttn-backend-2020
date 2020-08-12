import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  EnvServiceBinding,
  MailServiceBindings,
  SystemConfiguration,
} from '../../keys';
import {NodeMailerMailService} from '../../infrastructure/services/nodemailer.service';
import {Account} from '../../domain/models/account.model';
import {EnvService} from '../../infrastructure/services/env.service';
import {ConfigurationRepository} from '../../infrastructure/repositories';
import {
  Configuration,
  ConfigurationKey,
  ResetPasswordSettings,
  VerifyAccountSetting,
} from '../../domain/models/configuration.model';
import {HtmlParserService} from '../../infrastructure/services/htmlparser.service';

export type ResetPasswordContext = {
  FRONTEND_URL: string;
  USER_DISPLAY_NAME: string;
  USER_RESET_LINK: string;
};

export type VerifyPasswordContext = {
  FRONTEND_URL: string;
  USER_DISPLAY_NAME: string;
  USER_VERIFY_LINK: string;
};

export type EmailTemplateContext = ResetPasswordContext | VerifyPasswordContext;

export class MailService {
  constructor(
    // token provider
    @inject(MailServiceBindings.MAIL_SERVICE)
    private mailService: NodeMailerMailService,

    // env service
    @inject(EnvServiceBinding.ENVIRONMENT_VARIABLE)
    private envReader: EnvService,

    // setting repository
    @repository(ConfigurationRepository)
    private configRepo: ConfigurationRepository,

    // email parser
    @inject(MailServiceBindings.HTML_PARSER)
    private templateParser: HtmlParserService,

    // inject frontend base url
    @inject(SystemConfiguration.FRONTEND_BASE_URL)
    private frontendBaseUrl: string,
  ) {}

  private async parseEmailTemplate(
    template: string,
    templateContext: EmailTemplateContext,
  ): Promise<string> {
    return this.templateParser.render(template, templateContext);
  }

  public async sendVerifyAccountEmail(
    user: Account,
    token: string,
  ): Promise<boolean> {
    const baseUrl: string = this.frontendBaseUrl;

    const verifyAccountLink = `${baseUrl}/accounts/verify?token=${token}`;

    const verifyAccountSettings: Configuration = await this.configRepo.findById(
      ConfigurationKey.VERIFY_ACCOUNT_SETTINGS,
    );

    const {
      subject,
      emailTemplate: verifyPasswordTemplate,
      senderEmail,
      senderName,
    }: VerifyAccountSetting = verifyAccountSettings.data as VerifyAccountSetting;

    const emailTemplate: string = await this.parseEmailTemplate(
      verifyPasswordTemplate,
      {
        FRONTEND_URL: baseUrl,
        USER_DISPLAY_NAME: user.email,
        USER_VERIFY_LINK: verifyAccountLink,
      },
    );

    return this.mailService.sendMail({
      html: emailTemplate,
      to: user.email,
      subject: subject,
      from: senderEmail,
      sender: senderName,
    });
  }

  public async sendResetPasswordEmail(
    user: Account,
    token: string,
  ): Promise<boolean> {
    const url = process.env.BASE_SERVER_URL || 'http://127.0.0.1:3000';
    const baseUrl = `${url}`;
    const resetPasswordLink = `${url}/reset-password?token=${token}`;

    const resetPasswordSetting: Configuration = await this.configRepo.findById(
      ConfigurationKey.RESET_PASSWORD_SETTINGS,
    );

    const {
      subject,
      emailTemplate: resetPasswordEmailTemplate,
      senderEmail,
      senderName,
    }: ResetPasswordSettings = resetPasswordSetting.data as ResetPasswordSettings;

    const emailTemplate: string = await this.parseEmailTemplate(
      resetPasswordEmailTemplate,
      {
        FRONTEND_URL: baseUrl,
        USER_DISPLAY_NAME: user.email,
        USER_RESET_LINK: resetPasswordLink,
      },
    );

    return this.mailService.sendMail({
      html: emailTemplate,
      to: user.email,
      subject: subject,
      from: senderEmail,
      sender: senderName,
    });
  }
}
