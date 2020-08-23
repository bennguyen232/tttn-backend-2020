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
  ContentTypeDetail,
} from '../models';
import {IssueTypeRepository} from '../repositories';

export class IssueTypeContentTypeDetailController {
  constructor(
    @repository(IssueTypeRepository)
    public issueTypeRepository: IssueTypeRepository,
  ) { }

  @get('/issue-types/{id}/content-type-detail', {
    responses: {
      '200': {
        description: 'ContentTypeDetail belonging to IssueType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ContentTypeDetail)},
          },
        },
      },
    },
  })
  async getContentTypeDetail(
    @param.path.string('id') id: typeof IssueType.prototype.Id,
  ): Promise<ContentTypeDetail> {
    return this.issueTypeRepository.ContentTypeDetail(id);
  }
}
