import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Issue,
  IssueType,
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueIssueTypeController {
  constructor(
    @repository(IssueRepository) protected issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/issue-types', {
    responses: {
      '200': {
        description: 'Array of Issue has many IssueType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(IssueType)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<IssueType>,
  ): Promise<IssueType[]> {
    return this.issueRepository.IssueTypes(id).find(filter);
  }

  @post('/issues/{id}/issue-types', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: {'application/json': {schema: getModelSchemaRef(IssueType)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Issue.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {
            title: 'NewIssueTypeInIssue',
            exclude: ['Id'],
            optional: ['IssueId']
          }),
        },
      },
    }) issueType: Omit<IssueType, 'Id'>,
  ): Promise<IssueType> {
    return this.issueRepository.IssueTypes(id).create(issueType);
  }

  @patch('/issues/{id}/issue-types', {
    responses: {
      '200': {
        description: 'Issue.IssueType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {partial: true}),
        },
      },
    })
    issueType: Partial<IssueType>,
    @param.query.object('where', getWhereSchemaFor(IssueType)) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.issueRepository.IssueTypes(id).patch(issueType, where);
  }

  @del('/issues/{id}/issue-types', {
    responses: {
      '200': {
        description: 'Issue.IssueType DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(IssueType)) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.issueRepository.IssueTypes(id).delete(where);
  }
}
