import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Role} from './role.model';
import {User} from './user.model';

@model({
  settings: {
    strict: true,
    foreignKeys: {
      fk_userRole_roleId: {
        name: 'fk_userRole_roleId',
        entity: 'role',
        entityKey: 'Id',
        foreignKey: 'roleId',
      },
    },
  },
})
export class UserRole extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @belongsTo(() => Role)
  RoleId: string;

  @belongsTo(() => User)
  UserId: string;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
