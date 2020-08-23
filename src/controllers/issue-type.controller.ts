import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {IssueType} from '../models';
import {IssueTypeRepository} from '../repositories';

export class IssueTypeController {
  constructor(
    @repository(IssueTypeRepository)
    public issueTypeRepository : IssueTypeRepository,
  ) {}

  @post('/issue-types', {
    responses: {
      '200': {
        description: 'IssueType model instance',
        content: {'application/json': {schema: getModelSchemaRef(IssueType)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {
            title: 'NewIssueType',
            exclude: ['Id'],
          }),
        },
      },
    })
    issueType: Omit<IssueType, 'Id'>,
  ): Promise<IssueType> {
    return this.issueTypeRepository.create(issueType);
  }

  @get('/issue-types/count', {
    responses: {
      '200': {
        description: 'IssueType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(IssueType) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.issueTypeRepository.count(where);
  }

  @get('/issue-types', {
    responses: {
      '200': {
        description: 'Array of IssueType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(IssueType, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(IssueType) filter?: Filter<IssueType>,
  ): Promise<IssueType[]> {
    return this.issueTypeRepository.find(filter);
  }

  @patch('/issue-types', {
    responses: {
      '200': {
        description: 'IssueType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {partial: true}),
        },
      },
    })
    issueType: IssueType,
    @param.where(IssueType) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.issueTypeRepository.updateAll(issueType, where);
  }

  @get('/issue-types/{id}', {
    responses: {
      '200': {
        description: 'IssueType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(IssueType, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(IssueType, {exclude: 'where'}) filter?: FilterExcludingWhere<IssueType>
  ): Promise<IssueType> {
    return this.issueTypeRepository.findById(id, filter);
  }

  @patch('/issue-types/{id}', {
    responses: {
      '204': {
        description: 'IssueType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {partial: true}),
        },
      },
    })
    issueType: IssueType,
  ): Promise<void> {
    await this.issueTypeRepository.updateById(id, issueType);
  }

  @put('/issue-types/{id}', {
    responses: {
      '204': {
        description: 'IssueType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() issueType: IssueType,
  ): Promise<void> {
    await this.issueTypeRepository.replaceById(id, issueType);
  }

  @del('/issue-types/{id}', {
    responses: {
      '204': {
        description: 'IssueType DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.issueTypeRepository.deleteById(id);
  }
}
