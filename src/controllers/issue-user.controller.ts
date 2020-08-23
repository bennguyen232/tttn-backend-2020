import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Issue,
  User,
} from '../models';
import {IssueRepository} from '../repositories';

export class IssueUserController {
  constructor(
    @repository(IssueRepository)
    public issueRepository: IssueRepository,
  ) { }

  @get('/issues/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Issue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Issue.prototype.Id,
  ): Promise<User> {
    return this.issueRepository.UserCreated(id);
  }
}
