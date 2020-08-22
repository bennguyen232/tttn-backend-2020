import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ContentType} from './content-type.model';
import {Project} from './project.model';

@model({settings: {strict: true}})
export class ContentTypeDetail extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @belongsTo(() => ContentType)
  ContentTypeId: string;

  @belongsTo(() => Project)
  ProjectId: string;

  constructor(data?: Partial<ContentTypeDetail>) {
    super(data);
  }
}

export interface ContentTypeDetailRelations {
  // describe navigational properties here
}

export type ContentTypeDetailWithRelations = ContentTypeDetail & ContentTypeDetailRelations;
