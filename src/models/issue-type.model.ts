import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class IssueType extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<IssueType>) {
    super(data);
  }
}

export interface IssueTypeRelations {
  // describe navigational properties here
}

export type IssueTypeWithRelations = IssueType & IssueTypeRelations;
