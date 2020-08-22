import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class ContentTypeDetail extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  constructor(data?: Partial<ContentTypeDetail>) {
    super(data);
  }
}

export interface ContentTypeDetailRelations {
  // describe navigational properties here
}

export type ContentTypeDetailWithRelations = ContentTypeDetail & ContentTypeDetailRelations;
