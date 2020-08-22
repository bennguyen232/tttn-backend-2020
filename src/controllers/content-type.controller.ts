import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {ContentType, CategoryType} from '../models';
import {ContentTypeRepository} from '../repositories';

export class ContentTypeController {
  constructor(
    @repository(ContentTypeRepository)
    public contentTypeRepository: ContentTypeRepository,
  ) {}

  @post('/content-types', {
    responses: {
      '200': {
        description: 'ContentType model instance',
        content: {'application/json': {schema: getModelSchemaRef(ContentType)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentType, {
            title: 'NewContentType',
            exclude: ['Id'],
          }),
        },
      },
    })
    contentType: Omit<ContentType, 'Id'>,
  ): Promise<ContentType> {
    return this.contentTypeRepository.create(contentType);
  }

  @get('/content-types/count', {
    responses: {
      '200': {
        description: 'ContentType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(ContentType) where?: Where<ContentType>,
  ): Promise<Count> {
    return this.contentTypeRepository.count(where);
  }

  @get('/content-types', {
    responses: {
      '200': {
        description: 'Array of ContentType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ContentType, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(ContentType) filter?: Filter<ContentType>,
  ): Promise<ContentType[]> {
    return this.contentTypeRepository.find(filter);
  }

  @patch('/content-types', {
    responses: {
      '200': {
        description: 'ContentType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentType, {partial: true}),
        },
      },
    })
    contentType: ContentType,
    @param.where(ContentType) where?: Where<ContentType>,
  ): Promise<Count> {
    return this.contentTypeRepository.updateAll(contentType, where);
  }

  @get('/content-types/{id}', {
    responses: {
      '200': {
        description: 'ContentType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ContentType, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ContentType, {exclude: 'where'})
    filter?: FilterExcludingWhere<ContentType>,
  ): Promise<ContentType> {
    return this.contentTypeRepository.findById(id, filter);
  }

  @patch('/content-types/{id}', {
    responses: {
      '204': {
        description: 'ContentType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentType, {partial: true}),
        },
      },
    })
    contentType: ContentType,
  ): Promise<void> {
    await this.contentTypeRepository.updateById(id, contentType);
  }

  @put('/content-types/{id}', {
    responses: {
      '204': {
        description: 'ContentType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() contentType: ContentType,
  ): Promise<void> {
    await this.contentTypeRepository.replaceById(id, contentType);
  }

  @del('/content-types/{id}', {
    responses: {
      '204': {
        description: 'ContentType DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.contentTypeRepository.deleteById(id);
  }

  @get('/content-types/{id}/category-type', {
    responses: {
      '200': {
        description: 'CategoryType belonging to ContentType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CategoryType)},
          },
        },
      },
    },
  })
  async getCategoryTypeById(
    @param.path.string('id') id: typeof ContentType.prototype.Id,
  ): Promise<CategoryType> {
    return this.contentTypeRepository.CategoryType(id);
  }
}
