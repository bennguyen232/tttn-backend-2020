import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Project} from './project.model';
import {User} from './user.model';

@model({settings: {strict: true}})
export class ProjectMember extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @belongsTo(() => Project)
  ProjectId: string;

  @belongsTo(() => User)
  UserId: string;

  constructor(data?: Partial<ProjectMember>) {
    super(data);
  }
}

export interface ProjectMemberRelations {
  // describe navigational properties here
}

export type ProjectMemberWithRelations = ProjectMember & ProjectMemberRelations;
