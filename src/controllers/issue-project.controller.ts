import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Issue,
  Project,
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueProjectController {
  constructor(
    @repository(IssueRepository)
    public issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Issue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof Issue.prototype.Id,
  ): Promise<Project> {
    return this.issueRepository.Project(id);
  }
}
