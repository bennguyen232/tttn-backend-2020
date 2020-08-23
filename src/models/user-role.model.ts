import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Role} from './role.model';
import {User} from './user.model';
import {ProjectMember} from './project-member.model';

@model({settings: {strict: true}})
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

  @hasMany(() => ProjectMember, {keyTo: 'UserRoleId'})
  ProjectMembers: ProjectMember[];

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
