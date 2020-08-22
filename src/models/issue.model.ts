import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Issue extends Entity {
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
  Summary: string;

  @property({
    type: 'string',
    default: '' ,
  })
  Description?: string;

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

  constructor(data?: Partial<Issue>) {
    super(data);
  }
}

export interface IssueRelations {
  // describe navigational properties here
}

export type IssueWithRelations = Issue & IssueRelations;
