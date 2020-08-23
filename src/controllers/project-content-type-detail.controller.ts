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
  Project,
  ContentTypeDetail,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectContentTypeDetailController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/content-type-details', {
    responses: {
      '200': {
        description: 'Array of Project has many ContentTypeDetail',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ContentTypeDetail)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ContentTypeDetail>,
  ): Promise<ContentTypeDetail[]> {
    return this.projectRepository.ContentTypeDetails(id).find(filter);
  }

  @post('/projects/{id}/content-type-details', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ContentTypeDetail)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentTypeDetail, {
            title: 'NewContentTypeDetailInProject',
            exclude: ['Id'],
            optional: ['ProjectId']
          }),
        },
      },
    }) contentTypeDetail: Omit<ContentTypeDetail, 'Id'>,
  ): Promise<ContentTypeDetail> {
    return this.projectRepository.ContentTypeDetails(id).create(contentTypeDetail);
  }

  @patch('/projects/{id}/content-type-details', {
    responses: {
      '200': {
        description: 'Project.ContentTypeDetail PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContentTypeDetail, {partial: true}),
        },
      },
    })
    contentTypeDetail: Partial<ContentTypeDetail>,
    @param.query.object('where', getWhereSchemaFor(ContentTypeDetail)) where?: Where<ContentTypeDetail>,
  ): Promise<Count> {
    return this.projectRepository.ContentTypeDetails(id).patch(contentTypeDetail, where);
  }

  @del('/projects/{id}/content-type-details', {
    responses: {
      '200': {
        description: 'Project.ContentTypeDetail DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ContentTypeDetail)) where?: Where<ContentTypeDetail>,
  ): Promise<Count> {
    return this.projectRepository.ContentTypeDetails(id).delete(where);
  }
}
