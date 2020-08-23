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
  Sprint,
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueSprintController {
  constructor(
    @repository(IssueRepository)
    public issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/sprint', {
    responses: {
      '200': {
        description: 'Sprint belonging to Issue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Sprint)},
          },
        },
      },
    },
  })
  async getSprint(
    @param.path.string('id') id: typeof Issue.prototype.Id,
  ): Promise<Sprint> {
    return this.issueRepository.Sprint(id);
  }
}
