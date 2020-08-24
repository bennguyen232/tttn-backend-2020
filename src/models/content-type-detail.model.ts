import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {ContentType} from './content-type.model';
import {Project} from './project.model';
import {IssueType} from './issue-type.model';

@model({settings: {strict: true}})
export class ContentTypeDetail extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  IsActive?: boolean;

  @belongsTo(() => ContentType)
  ContentTypeId: string;

  @belongsTo(() => Project)
  ProjectId: string;

  @hasMany(() => IssueType, {keyTo: 'ContentTypeDetailId'})
  IssueTypes: IssueType[];

  constructor(data?: Partial<ContentTypeDetail>) {
    super(data);
  }
}

export interface ContentTypeDetailRelations {
  // describe navigational properties here
}

export type ContentTypeDetailWithRelations = ContentTypeDetail &
  ContentTypeDetailRelations;
