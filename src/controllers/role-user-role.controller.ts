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
  Role,
  UserRole,
} from '../models';
import {RoleRepository} from '../repositories';

export class RoleUserRoleController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Array of Role has many UserRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserRole)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserRole>,
  ): Promise<UserRole[]> {
    return this.roleRepository.UserRoles(id).find(filter);
  }

  @post('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserRole)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {
            title: 'NewUserRoleInRole',
            exclude: ['Id'],
            optional: ['RoleId']
          }),
        },
      },
    }) userRole: Omit<UserRole, 'Id'>,
  ): Promise<UserRole> {
    return this.roleRepository.UserRoles(id).create(userRole);
  }

  @patch('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role.UserRole PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {partial: true}),
        },
      },
    })
    userRole: Partial<UserRole>,
    @param.query.object('where', getWhereSchemaFor(UserRole)) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.roleRepository.UserRoles(id).patch(userRole, where);
  }

  @del('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role.UserRole DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserRole)) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.roleRepository.UserRoles(id).delete(where);
  }
}
