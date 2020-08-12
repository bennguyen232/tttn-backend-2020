import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Configuration,
  ConfigurationKey,
  MailSmtpSettings,
} from '../../domain/models/configuration.model';
import {ConfigurationRepository} from '../../infrastructure/repositories';
import {
  MailServiceBindings,
  SystemServiceBindings,
  AccountServiceBindings,
} from '../../keys';
import {AccountService} from '../services/account.service';
import {SystemService} from '../services/system.service';
import {Role} from '../../domain/models/account.model';
import {NodeMailerMailService} from '../../infrastructure/services/nodemailer.service';
import {Errors} from '../errors';

export class ConfigurationController {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,

    @inject(AccountServiceBindings.ACCOUNT_SERVICE)
    public accountService: AccountService,

    @inject(SystemServiceBindings.SYSTEM_SERVICE)
    public systemService: SystemService,

    @inject(MailServiceBindings.MAIL_SERVICE)
    public mailService: NodeMailerMailService,
  ) {}

  @post('/configurations', {
    responses: {
      '200': {
        description: 'Configuration model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Configuration)},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration),
        },
      },
    })
    configuration: Configuration,
  ): Promise<Configuration> {
    return this.configurationRepository.create(configuration);
  }

  @get('/configurations/count', {
    responses: {
      '200': {
        description: 'Configuration model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async count(
    @param.query.object('where', getWhereSchemaFor(Configuration))
    where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.count(where);
  }

  @get('/configurations', {
    responses: {
      '200': {
        description: 'Array of Configuration model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Configuration)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async find(
    @param.query.object('filter', getFilterSchemaFor(Configuration))
    filter?: Filter<Configuration>,
  ): Promise<Configuration[]> {
    return this.configurationRepository.find(filter);
  }

  @patch('/configurations', {
    responses: {
      '200': {
        description: 'Configuration PATCH success count',
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
          schema: getModelSchemaRef(Configuration, {partial: true}),
        },
      },
    })
    configuration: Configuration,
    @param.query.object('where', getWhereSchemaFor(Configuration))
    where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.updateAll(configuration, where);
  }

  @get('/configurations/{id}', {
    responses: {
      '200': {
        description: 'Configuration model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Configuration)},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async findById(
    @param.path.string('id') id: ConfigurationKey,
  ): Promise<Configuration> {
    return this.configurationRepository.findById(id);
  }

  @patch('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async updateById(
    @param.path.string('id') id: ConfigurationKey,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {partial: true}),
        },
      },
    })
    configuration: Configuration,
  ): Promise<void> {
    await this.configurationRepository.updateById(id, configuration);
  }

  @put('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async replaceById(
    @param.path.string('id') id: ConfigurationKey,
    @requestBody() configuration: Configuration,
  ): Promise<void> {
    // This is special for system configuration.
    // If the admin modify a configuration that does not exist yet, save it as
    // a new one, rather than throwing not found error.
    const configExisted = await this.configurationRepository.exists(id);
    if (configExisted) {
      await this.configurationRepository.replaceById(id, configuration);
    } else {
      await this.configurationRepository.create(configuration);
    }
  }

  @del('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async deleteById(
    @param.path.string('id') id: ConfigurationKey,
  ): Promise<void> {
    await this.configurationRepository.deleteById(id);
  }

  @post('/configurations/validate-mail-smtp-settings', {
    responses: {
      '200': {
        description: 'Validate system initialization password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {isValid: {type: 'boolean'}},
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async validateMailSmtpSettings(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              password: {type: 'string'},
              smtpHost: {type: 'string'},
              senderEmail: {type: 'string'},
              username: {type: 'string'},
              smtpPort: {type: 'string'},
            },
          },
        },
      },
    })
    body: MailSmtpSettings,
  ): Promise<{isValid: boolean}> {
    return {
      isValid: await this.mailService.isValidMailSmtpSetting(body),
    };
  }

  @post('/configurations/validate-system-initialization-password', {
    responses: {
      '200': {
        description: 'Validate system initialization password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {isValid: {type: 'boolean'}},
            },
          },
        },
      },
    },
  })
  validateSystemInitializationPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {password: {type: 'string'}},
          },
        },
      },
    })
    body: {
      password: String;
    },
  ): {isValid: boolean} {
    return {
      isValid: body.password === process.env.SYSTEM_INITIALIZATION_PASSWORD,
    };
  }

  @post('/configurations/initialize-system', {
    responses: {
      '200': {
        description: 'Validate system initialization password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {isValid: {type: 'boolean'}},
            },
          },
        },
      },
      '401': {
        description: 'System password is invalid',
      },
      '403': {
        description: 'System has been initialized already',
      },
      '409': {
        description: 'User email already existed',
      },
    },
  })
  async initializeSystem(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              password: {type: 'string'},
              admin: {
                type: 'object',
                properties: {
                  email: {type: 'string'},
                  password: {type: 'string'},
                },
              },
            },
          },
        },
      },
    })
    body: {
      password: string;
      admin: {
        email: string;
        password: string;
      };
    },
  ): Promise<{success: boolean}> {
    const systemInitialized = await this.systemService.isSystemInitialized();
    if (systemInitialized) {
      throw new HttpErrors.Forbidden(Errors.SYSTEM_INITIALIZED);
    }

    if (body.password !== process.env.SYSTEM_INITIALIZATION_PASSWORD) {
      throw new HttpErrors.Unauthorized(Errors.INVALID_SYSTEM_PASSWORD);
    }

    await this.accountService.createAdmin(body.admin);

    await this.systemService.markSystemAsInitialized();

    return {success: true};
  }

  /**
   * Admin can use this API to trigger system to be reinitialized.
   * E.g:
   *  - Refetch latest data from 3rd party sides and store to DB.
   *
   * If the system you're building does not really need this. Then feel free
   * to remove it.
   * @param body
   */
  @post('/configurations/reinitialize-system', {
    responses: {
      '200': {
        description: 'Validate system initialization password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {success: {type: 'boolean'}},
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [Role.ROOT_ADMIN]})
  async reinitializeSystem(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    })
    body: {},
  ): Promise<{success: boolean}> {
    return {success: true};
  }

  @post('/configurations/check-system-initialization-status', {
    responses: {
      '200': {
        description: 'Validate system initialization password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {isInitialized: {type: 'boolean'}},
            },
          },
        },
      },
    },
  })
  @authorize({
    resource: 'configuration',
    scopes: ['execute'],
    allowedRoles: [Role.USER],
  })
  async checkSystemInitializationStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    })
    body: {},
  ): Promise<{isInitialized: boolean}> {
    return {isInitialized: true};
  }
}
