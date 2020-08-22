import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  getWhereSchemaFor,
} from '@loopback/rest';
import {CategoryType, ContentType} from '../models';
import {CategoryTypeRepository} from '../repositories';

export class CategoryTypeController {
  constructor(
    @repository(CategoryTypeRepository)
    public categoryTypeRepository: CategoryTypeRepository,
  ) {}

  @post('/category-types', {
    responses: {
      '200': {
        description: 'CategoryType model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(CategoryType)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryType, {
            title: 'NewCategoryType',
            exclude: ['Id'],
          }),
        },
      },
    })
    categoryType: Omit<CategoryType, 'Id'>,
  ): Promise<CategoryType> {
    return this.categoryTypeRepository.create(categoryType);
  }

  @get('/category-types/count', {
    responses: {
      '200': {
        description: 'CategoryType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(CategoryType) where?: Where<CategoryType>,
  ): Promise<Count> {
    return this.categoryTypeRepository.count(where);
  }

  @get('/category-types', {
    responses: {
      '200': {
        description: 'Array of CategoryType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CategoryType, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(CategoryType) filter?: Filter<CategoryType>,
  ): Promise<CategoryType[]> {
    return this.categoryTypeRepository.find(filter);
  }

  @patch('/category-types', {
    responses: {
      '200': {
        description: 'CategoryType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryType, {partial: true}),
        },
      },
    })
    categoryType: CategoryType,
    @param.where(CategoryType) where?: Where<CategoryType>,
  ): Promise<Count> {
    return this.categoryTypeRepository.updateAll(categoryType, where);
  }

  @get('/category-types/{id}', {
    responses: {
      '200': {
        description: 'CategoryType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CategoryType, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('Id') id: string,
    @param.filter(CategoryType, {exclude: 'where'})
    filter?: FilterExcludingWhere<CategoryType>,
  ): Promise<CategoryType> {
    return this.categoryTypeRepository.findById(id, filter);
  }

  @patch('/category-types/{id}', {
    responses: {
      '204': {
        description: 'CategoryType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('Id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryType, {partial: true}),
        },
      },
    })
    categoryType: CategoryType,
  ): Promise<void> {
    await this.categoryTypeRepository.updateById(id, categoryType);
  }

  @put('/category-types/{id}', {
    responses: {
      '204': {
        description: 'CategoryType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('Id') id: string,
    @requestBody() categoryType: CategoryType,
  ): Promise<void> {
    await this.categoryTypeRepository.replaceById(id, categoryType);
  }

  @del('/category-types/{id}', {
    responses: {
      '204': {
        description: 'CategoryType DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('Id') id: string): Promise<void> {
    await this.categoryTypeRepository.deleteById(id);
  }

  // api relation
  @get('/category-types/{id}/content-types', {
    responses: {
      '200': {
        description: 'Array of CategoryType has many ContentType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ContentType)},
          },
        },
      },
    },
  })
  async findContentTypeById(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ContentType>,
  ): Promise<ContentType[]> {
    return this.categoryTypeRepository.contentTypes(id).find(filter);
  }

  @post('/category-types/{id}/content-types', {
    responses: {
      '200': {
        description: 'CategoryType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ContentType),
          },
        },
      },
    },
  })
  async createContentTypeById(
    @param.path.string('id') id: typeof CategoryType.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentType, {
            title: 'NewContentTypeInCategoryType',
            exclude: ['Id'],
            optional: ['categoryTypeId'],
          }),
        },
      },
    })
    contentType: Omit<ContentType, 'Id'>,
  ): Promise<ContentType> {
    return this.categoryTypeRepository.contentTypes(id).create(contentType);
  }

  @patch('/category-types/{id}/content-types', {
    responses: {
      '200': {
        description: 'CategoryType.ContentType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateContentTypeById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentType, {partial: true}),
        },
      },
    })
    contentType: Partial<ContentType>,
    @param.query.object('where', getWhereSchemaFor(ContentType))
    where?: Where<ContentType>,
  ): Promise<Count> {
    return this.categoryTypeRepository
      .contentTypes(id)
      .patch(contentType, where);
  }

  @del('/category-types/{id}/content-types', {
    responses: {
      '200': {
        description: 'CategoryType.ContentType DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deleteContentTypeById(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ContentType))
    where?: Where<ContentType>,
  ): Promise<Count> {
    return this.categoryTypeRepository.contentTypes(id).delete(where);
  }
}
