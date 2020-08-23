import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProjectMember,
  UserRole,
} from '../models';
import {ProjectMemberRepository} from '../repositories';

export class ProjectMemberUserRoleController {
  constructor(
    @repository(ProjectMemberRepository)
    public projectMemberRepository: ProjectMemberRepository,
  ) { }

  @get('/project-members/{id}/user-role', {
    responses: {
      '200': {
        description: 'UserRole belonging to ProjectMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserRole)},
          },
        },
      },
    },
  })
  async getUserRole(
    @param.path.string('id') id: typeof ProjectMember.prototype.Id,
  ): Promise<UserRole> {
    return this.projectMemberRepository.UserRole(id);
  }
}
