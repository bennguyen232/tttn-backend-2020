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
  UserRole,
  ProjectMember,
} from '../models';
import {UserRoleRepository} from '../repositories';

export class UserRoleProjectMemberController {
  constructor(
    @repository(UserRoleRepository) protected userRoleRepository: UserRoleRepository,
  ) { }

  @get('/user-roles/{id}/project-members', {
    responses: {
      '200': {
        description: 'Array of UserRole has many ProjectMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectMember)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ProjectMember>,
  ): Promise<ProjectMember[]> {
    return this.userRoleRepository.ProjectMembers(id).find(filter);
  }

  @post('/user-roles/{id}/project-members', {
    responses: {
      '200': {
        description: 'UserRole model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectMember)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserRole.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectMember, {
            title: 'NewProjectMemberInUserRole',
            exclude: ['Id'],
            optional: ['UserRoleId']
          }),
        },
      },
    }) projectMember: Omit<ProjectMember, 'Id'>,
  ): Promise<ProjectMember> {
    return this.userRoleRepository.ProjectMembers(id).create(projectMember);
  }

  @patch('/user-roles/{id}/project-members', {
    responses: {
      '200': {
        description: 'UserRole.ProjectMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectMember, {partial: true}),
        },
      },
    })
    projectMember: Partial<ProjectMember>,
    @param.query.object('where', getWhereSchemaFor(ProjectMember)) where?: Where<ProjectMember>,
  ): Promise<Count> {
    return this.userRoleRepository.ProjectMembers(id).patch(projectMember, where);
  }

  @del('/user-roles/{id}/project-members', {
    responses: {
      '200': {
        description: 'UserRole.ProjectMember DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProjectMember)) where?: Where<ProjectMember>,
  ): Promise<Count> {
    return this.userRoleRepository.ProjectMembers(id).delete(where);
  }
}
