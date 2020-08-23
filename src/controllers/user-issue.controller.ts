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
  User,
  Issue,
} from '../models';
import {UserRepository} from '../repositories';

export class UserIssueController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/issues', {
    responses: {
      '200': {
        description: 'Array of User has many Issue',
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
    return this.userRepository.IssueAssignees(id).find(filter);
  }

  @post('/users/{id}/issues', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Issue)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssueInUser',
            exclude: ['Id'],
            optional: ['AssigneeId']
          }),
        },
      },
    }) issue: Omit<Issue, 'Id'>,
  ): Promise<Issue> {
    return this.userRepository.IssueAssignees(id).create(issue);
  }

  @patch('/users/{id}/issues', {
    responses: {
      '200': {
        description: 'User.Issue PATCH success count',
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
    return this.userRepository.IssueAssignees(id).patch(issue, where);
  }

  @del('/users/{id}/issues', {
    responses: {
      '200': {
        description: 'User.Issue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.userRepository.IssueAssignees(id).delete(where);
  }
}
