import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  IssueType,
  Issue,
} from '../models';
import {IssueTypeRepository} from '../repositories';

export class IssueTypeIssueController {
  constructor(
    @repository(IssueTypeRepository)
    public issueTypeRepository: IssueTypeRepository,
  ) { }

  @get('/issue-types/{id}/issue', {
    responses: {
      '200': {
        description: 'Issue belonging to IssueType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Issue)},
          },
        },
      },
    },
  })
  async getIssue(
    @param.path.string('id') id: typeof IssueType.prototype.Id,
  ): Promise<Issue> {
    return this.issueTypeRepository.Issue(id);
  }
}
