import {Transporter, createTransport} from 'nodemailer';
import {repository} from '@loopback/repository';
import {
  Configuration,
  ConfigurationKey,
  MailSmtpSettings,
} from '../../domain/models/configuration.model';
import {Account} from '../../domain/models/account.model';
import {ConfigurationRepository} from '../repositories';
import Mail = require('nodemailer/lib/mailer');

type NodeEmailResult = [Transporter, MailSmtpSettings] | null;

export class NodeMailerMailService {
  constructor(
    @repository(ConfigurationRepository)
    private configurationRepository: ConfigurationRepository,
  ) {}

  async isValidMailSmtpSetting(
    mailSmtpSettings: MailSmtpSettings,
  ): Promise<boolean> {
    const nodeMailer: Mail = createTransport({
      host: mailSmtpSettings.smtpHost,
      port: Number(mailSmtpSettings.smtpPort),
      auth: {
        user: mailSmtpSettings.username,
        pass: mailSmtpSettings.password,
      },
    });

    try {
      return await nodeMailer.verify();
    } catch (e) {
      return false;
    }
  }

  async sendMail(mailOptions: Mail.Options): Promise<boolean> {
    const nodeEmailResult: NodeEmailResult = await this.loadNodeMailerTransporter();

    if (!nodeEmailResult) {
      return false;
    }

    const [nodeMailerTransporter, smtpConfigData] = nodeEmailResult;

    try {
      await nodeMailerTransporter.sendMail({
        from: smtpConfigData.senderEmail,
        sender: smtpConfigData.senderName,
        ...mailOptions,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
    //TODO: handle mail sent failed, email logging
  }

  async sendSignUpMail(newUser: Account): Promise<boolean> {
    const nodeEmailResult: NodeEmailResult = await this.loadNodeMailerTransporter();

    if (!nodeEmailResult) {
      return false;
    }

    const [nodeMailerTransporter, smtpConfigData] = nodeEmailResult;

    // TODO: should query from db, no hard code here
    const accountVerificationEmailSettingsConfig = {
      subject: 'Please verify your email address',
      message: '<b>Registered!<b>',
    };

    try {
      await nodeMailerTransporter.sendMail({
        from: smtpConfigData.senderEmail,
        to: newUser.email,
        subject: accountVerificationEmailSettingsConfig.subject,
        html: accountVerificationEmailSettingsConfig.message,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  private async loadNodeMailerTransporter(): Promise<NodeEmailResult> {
    const smtpConfig: Configuration = await this.configurationRepository.findById(
      ConfigurationKey.MAIL_SMTP_SETTINGS,
    );

    if (!smtpConfig) {
      return null;
    }

    const mailSmtpSettings: MailSmtpSettings = smtpConfig.data as MailSmtpSettings;

    const transporter = createTransport({
      host: mailSmtpSettings.smtpHost,
      port: Number(mailSmtpSettings.smtpPort),
      auth: {
        user: mailSmtpSettings.username,
        pass: mailSmtpSettings.password,
      },
    });

    return [transporter, mailSmtpSettings];
  }
}
