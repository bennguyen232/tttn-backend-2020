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
import {TaskRepository} from '../../infrastructure/repositories';
import {TaskServiceBindings} from '../../keys';
import {TaskService} from '../services/task.service';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,

    @inject(TaskServiceBindings.TASK_SERVICE)
    private taskService: TaskService,
  ) {}

  @post('/tasks', {
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
    return this.taskRepository.create(tag);
  }

  @get('/tasks', {
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
    return this.taskRepository.find(filter);
  }

  @get('/tasks/{id}', {
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
    return this.taskRepository.findById(id);
  }

  @get('/tasks/count', {
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
    return this.taskRepository.count(where);
  }

  @patch('/tasks/{id}', {
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
    await this.taskRepository.updateById(id, tag);
  }

  @put('/tasks/{id}', {
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
    await this.taskRepository.replaceById(id, tag);
  }

  @del('/tasks/{id}', {
    responses: {
      '200': {
        description: 'Tag delete success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: [AUTHENTICATED]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }
}
