import {Entity, model, property, hasMany} from '@loopback/repository';
import {ContentType} from './content-type.model';

@model({settings: {strict: true}})
export class CategoryType extends Entity {
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

  @hasMany(() => ContentType)
  contentTypes: ContentType[];

  constructor(data?: Partial<CategoryType>) {
    super(data);
  }
}

export interface CategoryTypeRelations {
  // describe navigational properties here
}

export type CategoryTypeWithRelations = CategoryType & CategoryTypeRelations;
