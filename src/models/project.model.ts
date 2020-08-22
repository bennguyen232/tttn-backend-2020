import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
