import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ProjectMember extends Entity {
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

  constructor(data?: Partial<ProjectMember>) {
    super(data);
  }
}

export interface ProjectMemberRelations {
  // describe navigational properties here
}

export type ProjectMemberWithRelations = ProjectMember & ProjectMemberRelations;
