import {
  Entity,
  model,
  property,
  hasMany,
  belongsTo,
} from '@loopback/repository';
import {ProjectMember} from './project-member.model';
import {ContentTypeDetail} from './content-type-detail.model';
import {User} from './user.model';
import {Issue} from './issue.model';

@model({settings: {strict: true}})
export class Project extends Entity {
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
    default: '',
  })
  Description?: string;

  @property({
    type: 'string',
    default: '',
  })
  UrlImage?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  IsActive?: boolean;

  @property({
    type: 'date',
  })
  CreatedAt?: string;

  @property({
    type: 'date',
  })
  UpdatedAt?: string;

  @hasMany(() => ProjectMember, {keyTo: 'ProjectId'})
  ProjectMembers: ProjectMember[];

  @hasMany(() => ContentTypeDetail, {keyTo: 'ProjectId'})
  ContentTypeDetails: ContentTypeDetail[];

  @belongsTo(() => User)
  UserCreatedId: string;

  @hasMany(() => Issue, {keyTo: 'ProjectId'})
  Issues: Issue[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
