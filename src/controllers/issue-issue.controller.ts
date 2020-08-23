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
import {Issue} from '../models';
import {IssueRepository} from '../repositories';

export class IssueIssueController {
  constructor(
    @repository(IssueRepository) protected issueRepository: IssueRepository,
  ) {}

  @get('/issues/{id}/issues', {
    responses: {
      '200': {
        description: 'Array of Issue has many Issue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Issue)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Issue>,
  ): Promise<Issue[]> {
    return this.issueRepository.IssuesChildren(id).find(filter);
  }

  @post('/issues/{id}/issues', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: {'application/json': {schema: getModelSchemaRef(Issue)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Issue.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssueInIssue',
            exclude: ['Id'],
            optional: ['IssueParentId'],
          }),
        },
      },
    })
    issue: Omit<Issue, 'Id'>,
  ): Promise<Issue> {
    return this.issueRepository.IssuesChildren(id).create(issue);
  }

  @patch('/issues/{id}/issues', {
    responses: {
      '200': {
        description: 'Issue.Issue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {partial: true}),
        },
      },
    })
    issue: Partial<Issue>,
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.issueRepository.IssuesChildren(id).patch(issue, where);
  }

  @del('/issues/{id}/issues', {
    responses: {
      '200': {
        description: 'Issue.Issue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.issueRepository.IssuesChildren(id).delete(where);
  }
}
