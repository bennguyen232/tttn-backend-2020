import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Sprint extends Entity {
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

  constructor(data?: Partial<Sprint>) {
    super(data);
  }
}

export interface SprintRelations {
  // describe navigational properties here
}

export type SprintWithRelations = Sprint & SprintRelations;
