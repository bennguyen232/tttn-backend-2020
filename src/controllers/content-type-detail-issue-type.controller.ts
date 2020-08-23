import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ContentTypeDetail,
  IssueType,
} from '../models';
import {ContentTypeDetailRepository} from '../repositories';

export class ContentTypeDetailIssueTypeController {
  constructor(
    @repository(ContentTypeDetailRepository) protected contentTypeDetailRepository: ContentTypeDetailRepository,
  ) { }

  @get('/content-type-details/{id}/issue-types', {
    responses: {
      '200': {
        description: 'Array of ContentTypeDetail has many IssueType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(IssueType)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<IssueType>,
  ): Promise<IssueType[]> {
    return this.contentTypeDetailRepository.IssueTypes(id).find(filter);
  }

  @post('/content-type-details/{id}/issue-types', {
    responses: {
      '200': {
        description: 'ContentTypeDetail model instance',
        content: {'application/json': {schema: getModelSchemaRef(IssueType)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ContentTypeDetail.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {
            title: 'NewIssueTypeInContentTypeDetail',
            exclude: ['Id'],
            optional: ['ContentTypeDetailId']
          }),
        },
      },
    }) issueType: Omit<IssueType, 'Id'>,
  ): Promise<IssueType> {
    return this.contentTypeDetailRepository.IssueTypes(id).create(issueType);
  }

  @patch('/content-type-details/{id}/issue-types', {
    responses: {
      '200': {
        description: 'ContentTypeDetail.IssueType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IssueType, {partial: true}),
        },
      },
    })
    issueType: Partial<IssueType>,
    @param.query.object('where', getWhereSchemaFor(IssueType)) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.contentTypeDetailRepository.IssueTypes(id).patch(issueType, where);
  }

  @del('/content-type-details/{id}/issue-types', {
    responses: {
      '200': {
        description: 'ContentTypeDetail.IssueType DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(IssueType)) where?: Where<IssueType>,
  ): Promise<Count> {
    return this.contentTypeDetailRepository.IssueTypes(id).delete(where);
  }
}
