import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Project,
  ProjectMember,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectProjectMemberController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/project-members', {
    responses: {
      '200': {
        description: 'Array of Project has many ProjectMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectMember)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ProjectMember>,
  ): Promise<ProjectMember[]> {
    return this.projectRepository.ProjectMembers(id).find(filter);
  }

  @post('/projects/{id}/project-members', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectMember)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectMember, {
            title: 'NewProjectMemberInProject',
            exclude: ['Id'],
            optional: ['ProjectId']
          }),
        },
      },
    }) projectMember: Omit<ProjectMember, 'Id'>,
  ): Promise<ProjectMember> {
    return this.projectRepository.ProjectMembers(id).create(projectMember);
  }

  @patch('/projects/{id}/project-members', {
    responses: {
      '200': {
        description: 'Project.ProjectMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectMember, {partial: true}),
        },
      },
    })
    projectMember: Partial<ProjectMember>,
    @param.query.object('where', getWhereSchemaFor(ProjectMember)) where?: Where<ProjectMember>,
  ): Promise<Count> {
    return this.projectRepository.ProjectMembers(id).patch(projectMember, where);
  }

  @del('/projects/{id}/project-members', {
    responses: {
      '200': {
        description: 'Project.ProjectMember DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProjectMember)) where?: Where<ProjectMember>,
  ): Promise<Count> {
    return this.projectRepository.ProjectMembers(id).delete(where);
  }
}
