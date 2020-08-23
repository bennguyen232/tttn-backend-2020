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
  Sprint,
  Issue,
} from '../models';
import {SprintRepository} from '../repositories';

export class SprintIssueController {
  constructor(
    @repository(SprintRepository) protected sprintRepository: SprintRepository,
  ) { }

  @get('/sprints/{id}/issues', {
    responses: {
      '200': {
        description: 'Array of Sprint has many Issue',
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
    return this.sprintRepository.Issues(id).find(filter);
  }

  @post('/sprints/{id}/issues', {
    responses: {
      '200': {
        description: 'Sprint model instance',
        content: {'application/json': {schema: getModelSchemaRef(Issue)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Sprint.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssueInSprint',
            exclude: ['Id'],
            optional: ['SprintId']
          }),
        },
      },
    }) issue: Omit<Issue, 'Id'>,
  ): Promise<Issue> {
    return this.sprintRepository.Issues(id).create(issue);
  }

  @patch('/sprints/{id}/issues', {
    responses: {
      '200': {
        description: 'Sprint.Issue PATCH success count',
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
    return this.sprintRepository.Issues(id).patch(issue, where);
  }

  @del('/sprints/{id}/issues', {
    responses: {
      '200': {
        description: 'Sprint.Issue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.sprintRepository.Issues(id).delete(where);
  }
}
