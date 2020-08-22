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
  ContentType,
} from '../models';
import {ContentTypeDetailRepository} from '../repositories';

export class ContentTypeDetailContentTypeController {
  constructor(
    @repository(ContentTypeDetailRepository)
    public contentTypeDetailRepository: ContentTypeDetailRepository,
  ) { }

  @get('/content-type-details/{id}/content-type', {
    responses: {
      '200': {
        description: 'ContentType belonging to ContentTypeDetail',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ContentType)},
          },
        },
      },
    },
  })
  async getContentType(
    @param.path.string('id') id: typeof ContentTypeDetail.prototype.Id,
  ): Promise<ContentType> {
    return this.contentTypeDetailRepository.ContentType(id);
  }
}
