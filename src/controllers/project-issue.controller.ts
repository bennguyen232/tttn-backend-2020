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
  Project,
  Issue,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectIssueController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/issues', {
    responses: {
      '200': {
        description: 'Array of Project has many Issue',
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
    return this.projectRepository.Issues(id).find(filter);
  }

  @post('/projects/{id}/issues', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Issue)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssueInProject',
            exclude: ['Id'],
            optional: ['ProjectId']
          }),
        },
      },
    }) issue: Omit<Issue, 'Id'>,
  ): Promise<Issue> {
    return this.projectRepository.Issues(id).create(issue);
  }

  @patch('/projects/{id}/issues', {
    responses: {
      '200': {
        description: 'Project.Issue PATCH success count',
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
    return this.projectRepository.Issues(id).patch(issue, where);
  }

  @del('/projects/{id}/issues', {
    responses: {
      '200': {
        description: 'Project.Issue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.projectRepository.Issues(id).delete(where);
  }
}
