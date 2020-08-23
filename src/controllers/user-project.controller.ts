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
  Project,
} from '../models';
import {UserRepository} from '../repositories';

export class UserProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'Array of User has many Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.userRepository.ProjectCreators(id).find(filter);
  }

  @post('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProjectInUser',
            exclude: ['Id'],
            optional: ['UserCreatedId']
          }),
        },
      },
    }) project: Omit<Project, 'Id'>,
  ): Promise<Project> {
    return this.userRepository.ProjectCreators(id).create(project);
  }

  @patch('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'User.Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Partial<Project>,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.userRepository.ProjectCreators(id).patch(project, where);
  }

  @del('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'User.Project DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.userRepository.ProjectCreators(id).delete(where);
  }
}
