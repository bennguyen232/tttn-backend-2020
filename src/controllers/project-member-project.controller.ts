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
  Project,
} from '../models';
import {ProjectMemberRepository} from '../repositories';

export class ProjectMemberProjectController {
  constructor(
    @repository(ProjectMemberRepository)
    public projectMemberRepository: ProjectMemberRepository,
  ) { }

  @get('/project-members/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to ProjectMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof ProjectMember.prototype.Id,
  ): Promise<Project> {
    return this.projectMemberRepository.Project(id);
  }
}
