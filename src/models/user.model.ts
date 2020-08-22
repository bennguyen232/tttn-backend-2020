import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserRole} from './user-role.model';
import {ProjectMember} from './project-member.model';

@model({settings: {strict: true}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id: string;

  @property({
    type: 'string',
    required: true,
  })
  Username: string;

  @property({
    type: 'string',
    required: true,
  })
  Password: string;

  @property({
    type: 'string',
    required: true,
  })
  FirstName: string;

  @property({
    type: 'string',
    required: true,
  })
  LastName: string;

  @property({
    type: 'string',
    default: '',
  })
  PhoneNumber?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  Gender?: boolean;

  @property({
    type: 'string',
    default: '',
  })
  Address?: string;

  @hasMany(() => UserRole, {keyTo: 'UserId'})
  UserRoles: UserRole[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
