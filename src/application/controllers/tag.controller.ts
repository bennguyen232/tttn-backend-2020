import {
  repository,
  Filter,
  CountSchema,
  Where,
  Count,
} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  requestBody,
  get,
  param,
  getFilterSchemaFor,
  Request,
  Response,
  RestBindings,
  getWhereSchemaFor,
  patch,
  del,
  put,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';

import {authorize, AUTHENTICATED} from '@loopback/authorization';
import {Tag} from '../../domain/models/tag.model';
import {TagRepository} from '../../infrastructure/repositories/tag.repository';
import {S3Service} from '../services/s3.service';
import {S3ServiceBindings} from '../../keys';

export class TagController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,

    @inject(S3ServiceBindings.S3_SERVICE)
    private s3Service: S3Service,
  ) {}

  @post('/tags', {
    responses: {
      '200': {
        description: 'Tag model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Tag)},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag),
        },
      },
    })
    tag: Tag,
  ): Promise<Tag> {
    return this.tagRepository.create(tag);
  }

  @get('/tags', {
    responses: {
      '200': {
        description: 'Array of tag model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async find(
    @param.query.object('filter', getFilterSchemaFor(Tag))
    filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.tagRepository.find(filter);
  }

  @get('/tags/{id}', {
    responses: {
      '200': {
        description: 'Tag model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Tag)},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async findById(@param.path.string('id') id: string): Promise<Tag> {
    return this.tagRepository.findById(id);
  }

  @get('/tags/count', {
    responses: {
      '200': {
        description: 'Tag model count',
        content: {
          'application/json': {schema: CountSchema},
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async count(
    @param.query.object('where', getWhereSchemaFor(Tag))
    where?: Where<Tag>,
  ): Promise<Count> {
    return this.tagRepository.count(where);
  }

  @patch('/tags/{id}', {
    responses: {
      '204': {
        description: 'Tag PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {partial: true}),
        },
      },
    })
    tag: Tag,
  ): Promise<void> {
    await this.tagRepository.updateById(id, tag);
  }

  @put('/tags/{id}', {
    responses: {
      '204': {
        description: 'Tag PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tag: Tag,
  ): Promise<void> {
    await this.tagRepository.replaceById(id, tag);
  }

  @del('/tags/{id}', {
    responses: {
      '200': {
        description: 'Tag delete success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tagRepository.deleteById(id);
  }

  @post('/tags/upload-image', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async uploadImage(
    @requestBody.file({
      required: true,
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return this.s3Service.uploadToFolder(request, response, 'tags');
  }
}
