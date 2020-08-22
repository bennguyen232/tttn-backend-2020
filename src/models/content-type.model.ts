import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CategoryType} from './category-type.model';

@model({settings: {strict: true}})
export class ContentType extends Entity {
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
  IconName?: string;

  @property({
    type: 'string',
    default: '',
  })
  Styles?: string;

  @belongsTo(() => CategoryType)
  categoryTypeId: string;

  constructor(data?: Partial<ContentType>) {
    super(data);
  }
}

export interface ContentTypeRelations {
  // describe navigational properties here
}

export type ContentTypeWithRelations = ContentType & ContentTypeRelations;
