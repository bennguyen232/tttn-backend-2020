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
  HttpErrors,
} from '@loopback/rest';
import {Project, Issue} from '../models';
import {
  ProjectRepository,
  UserRoleRepository,
  RoleRepository,
  ProjectMemberRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import _ from 'lodash';

export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
    @repository(ProjectMemberRepository)
    public projectMemberRepository: ProjectMemberRepository,
  ) {}

  @authenticate('jwt')
  @post('/projects', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: [
              'Id',
              'CreatedAt',
              'UpdatedAt',
              'UserCreatedId',
              'IsActive',
            ],
          }),
        },
      },
    })
    newProject: Omit<Project, 'Id'>,
  ): Promise<Project> {
    const currentId = currentUserProfile[securityId];
    Object.assign(newProject, {
      UserCreatedId: currentId,
    });
    const project = await this.projectRepository.create(newProject);
    const role = await this.roleRepository.findOne({
      where: {Name: 'MANAGER'},
    });
    if (!role) throw new HttpErrors[404]('Role is not valid');

    let userRoleId;
    const userRole = await this.userRoleRepository.findOne({
      where: {
        RoleId: role.Id,
        UserId: currentId,
      },
    });
    if (!userRole) {
      const {Id} = await this.userRoleRepository.create({
        RoleId: role.Id,
        UserId: currentId,
      });
      userRoleId = Id;
    } else {
      userRoleId = userRole.Id;
    }

    await this.projectMemberRepository.create({
      ProjectId: project.Id,
      UserRoleId: userRoleId,
    });
    return project;
  }

  @authenticate('jwt')
  @get('/projects/count', {
    responses: {
      '200': {
        description: 'Project model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Project) where?: Where<Project>): Promise<Count> {
    return this.projectRepository.count(where);
  }

  @authenticate('jwt')
  @get('/projects', {
    responses: {
      '200': {
        description: 'Array of Project model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Project, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/projects', {
    responses: {
      '200': {
        description: 'Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.updateAll(project, where);
  }

  @authenticate('jwt')
  @get('/projects/{id}', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Project, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Project, {exclude: 'where'})
    filter?: FilterExcludingWhere<Project>,
  ): Promise<Project> {
    return this.projectRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/projects/{id}', {
    responses: {
      '204': {
        description: 'Project PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    await this.projectRepository.updateById(id, project);
  }

  @authenticate('jwt')
  @put('/projects/{id}', {
    responses: {
      '204': {
        description: 'Project PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() project: Project,
  ): Promise<void> {
    await this.projectRepository.replaceById(id, project);
  }

  @authenticate('jwt')
  @del('/projects/{id}', {
    responses: {
      '204': {
        description: 'Project DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectRepository.deleteById(id);
  }

  @authenticate('jwt')
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
  async findIssuesByProjectId(
    @param.path.string('id') id: string,
  ): Promise<Issue[]> {
    return this.projectRepository.Issues(id).find({
      where: {IsActive: true},
    });
  }
}
