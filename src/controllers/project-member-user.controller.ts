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
  User,
} from '../models';
import {ProjectMemberRepository} from '../repositories';

export class ProjectMemberUserController {
  constructor(
    @repository(ProjectMemberRepository)
    public projectMemberRepository: ProjectMemberRepository,
  ) { }

  @get('/project-members/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ProjectMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof ProjectMember.prototype.Id,
  ): Promise<User> {
    return this.projectMemberRepository.User(id);
  }
}
