import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ContentTypeDetail} from './content-type-detail.model';
import {Issue} from './issue.model';

@model({settings: {strict: true}})
export class IssueType extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @belongsTo(() => ContentTypeDetail)
  ContentTypeDetailId: string;

  @belongsTo(() => Issue)
  IssueId: string;

  constructor(data?: Partial<IssueType>) {
    super(data);
  }
}

export interface IssueTypeRelations {
  // describe navigational properties here
}

export type IssueTypeWithRelations = IssueType & IssueTypeRelations;
