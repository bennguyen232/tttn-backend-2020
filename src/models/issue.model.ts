import {
  Entity,
  model,
  property,
  hasMany,
  belongsTo,
} from '@loopback/repository';
import {IssueType} from './issue-type.model';
import {Project} from './project.model';
import {Sprint} from './sprint.model';
import {User} from './user.model';

@model({settings: {strict: true}})
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
    default: '',
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

  @hasMany(() => IssueType, {keyTo: 'IssueId'})
  IssueTypes: IssueType[];

  @belongsTo(() => Issue)
  IssueParentId: string;

  @belongsTo(() => Project)
  ProjectId: string;

  @belongsTo(() => Sprint)
  SprintId: string;

  @hasMany(() => Issue, {keyTo: 'IssueParentId'})
  IssuesChildren: Issue[];

  @belongsTo(() => User)
  UserCreatedId: string;

  @belongsTo(() => User)
  AssigneeId: string;

  constructor(data?: Partial<Issue>) {
    super(data);
  }
}

export interface IssueRelations {
  // describe navigational properties here
}

export type IssueWithRelations = Issue & IssueRelations;
