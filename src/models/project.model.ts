import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProjectMember} from './project-member.model';

@model({settings: {strict: false}})
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
  })
  Description?: string;

  @property({
    type: 'string',
    default: '',
  })
  UrlImage?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  IsActive: boolean;

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

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
