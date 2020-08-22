import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserRole} from './user-role.model';

@model({settings: {strict: true}})
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Name: string;

  @property({
    type: 'string',
    required: true,
  })
  Description: string;

  @hasMany(() => UserRole, {keyTo: 'RoleId'})
  UserRoles: UserRole[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
