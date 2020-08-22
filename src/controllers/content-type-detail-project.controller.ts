import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ContentTypeDetail,
  Project,
} from '../models';
import {ContentTypeDetailRepository} from '../repositories';

export class ContentTypeDetailProjectController {
  constructor(
    @repository(ContentTypeDetailRepository)
    public contentTypeDetailRepository: ContentTypeDetailRepository,
  ) { }

  @get('/content-type-details/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to ContentTypeDetail',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof ContentTypeDetail.prototype.Id,
  ): Promise<Project> {
    return this.contentTypeDetailRepository.Project(id);
  }
}
