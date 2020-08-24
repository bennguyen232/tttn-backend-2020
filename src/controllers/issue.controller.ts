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
import {Issue} from '../models';
import {IssueRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';

export class IssueController {
  constructor(
    @repository(IssueRepository)
    public issueRepository : IssueRepository,
  ) {}

  @authenticate('jwt')
  @post('/issues', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: {'application/json': {schema: getModelSchemaRef(Issue)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssue',
            exclude: ['Id'],
          }),
        },
      },
    })
    issue: Omit<Issue, 'Id'>,
  ): Promise<Issue> {
    return this.issueRepository.create(issue);
  }

  @authenticate('jwt')
  @get('/issues/count', {
    responses: {
      '200': {
        description: 'Issue model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Issue) where?: Where<Issue>,
  ): Promise<Count> {
    return this.issueRepository.count(where);
  }

  @authenticate('jwt')
  @get('/issues', {
    responses: {
      '200': {
        description: 'Array of Issue model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Issue, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Issue) filter?: Filter<Issue>,
  ): Promise<Issue[]> {
    return this.issueRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/issues', {
    responses: {
      '200': {
        description: 'Issue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {partial: true}),
        },
      },
    })
    issue: Issue,
    @param.where(Issue) where?: Where<Issue>,
  ): Promise<Count> {
    return this.issueRepository.updateAll(issue, where);
  }

  @authenticate('jwt')
  @get('/issues/{id}', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Issue, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Issue, {exclude: 'where'}) filter?: FilterExcludingWhere<Issue>
  ): Promise<Issue> {
    return this.issueRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/issues/{id}', {
    responses: {
      '204': {
        description: 'Issue PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {partial: true}),
        },
      },
    })
    issue: Issue,
  ): Promise<void> {
    await this.issueRepository.updateById(id, issue);
  }

  @authenticate('jwt')
  @put('/issues/{id}', {
    responses: {
      '204': {
        description: 'Issue PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() issue: Issue,
  ): Promise<void> {
    await this.issueRepository.replaceById(id, issue);
  }

  // @authenticate('jwt')
  // @del('/issues/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Issue DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.issueRepository.deleteById(id);
  // }
}
