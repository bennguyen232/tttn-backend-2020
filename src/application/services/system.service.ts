import {repository} from '@loopback/repository';
import {ConfigurationRepository} from '../../infrastructure/repositories';
import {
  Configuration,
  ConfigurationKey,
  SystemStatus,
  SystemStatusData,
} from '../../domain/models/configuration.model';

export class SystemService {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
  ) {}

  async isSystemInitialized(): Promise<boolean> {
    const systemStatusConfig = await this._getSystemStatusConfig();

    if (!systemStatusConfig || !systemStatusConfig.data) {
      return false;
    }

    const systemStatus = (systemStatusConfig.data as SystemStatusData).status;
    return systemStatus === SystemStatus.INITIALIZED;
  }

  async markSystemAsInitialized(): Promise<void> {
    const systemStatusConfig = await this._getSystemStatusConfig();

    if (systemStatusConfig) {
      await this.configurationRepository.updateById(
        ConfigurationKey.SYSTEM_STATUS,
        {
          data: {
            status: SystemStatus.INITIALIZED,
          },
        },
      );
    } else {
      await this.configurationRepository.create({
        id: ConfigurationKey.SYSTEM_STATUS,
        data: {
          status: SystemStatus.INITIALIZED,
        },
      });
    }
  }

  async _getSystemStatusConfig(): Promise<Configuration | null> {
    return this.configurationRepository.findOne({
      where: {id: ConfigurationKey.SYSTEM_STATUS},
    });
  }
}
