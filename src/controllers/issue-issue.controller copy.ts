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
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueIssueController {
  constructor(
    @repository(IssueRepository)
    public issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/issue', {
    responses: {
      '200': {
        description: 'Issue belonging to Issue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Issue)},
          },
        },
      },
    },
  })
  async getIssue(
    @param.path.string('id') id: typeof Issue.prototype.Id,
  ): Promise<Issue> {
    return this.issueRepository.IssueParent(id);
  }
}
