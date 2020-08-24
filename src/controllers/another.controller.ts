// Uncomment these imports to begin using these cool features!

import {post, param, requestBody, get} from '@loopback/rest';
import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {VALIDATIONS_DEFAULT_DATA, ROLES} from '../data/setup';
import {
  CategoryTypeRepository,
  ContentTypeRepository,
  ProjectRepository,
  RoleRepository,
} from '../repositories';
import {repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';

export class AnotherController {
  constructor(
    @repository(CategoryTypeRepository)
    private categoryTypeRepository: CategoryTypeRepository,
    @repository(ContentTypeRepository)
    private contentTypeRepository: ContentTypeRepository,
    @repository(ProjectRepository)
    private projectRepository: ProjectRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  // @post('/another/setup/{password}', {
  @post('/another/setup', {
    responses: {
      '200': {
        description: 'CategoryType model instance',
        // content: {
        //   'application/json': {schema: getModelSchemaRef(CategoryType)},
        // },
      },
    },
  })
  // @param.path.string('password') password: string,
  async createSetup(): Promise<any | void> {
    // if (password !== '123456') return;
    // this.contentTypeRepository.CategoryType('')

    // await this.contentTypeRepository.replaceById(id, contentType);
    for (const category of VALIDATIONS_DEFAULT_DATA) {
      const categoryResult = await this.categoryTypeRepository.create({
        Name: category.Name,
        Description: category.Description,
      });
      for (const content of category.ContentType) {
        await this.categoryTypeRepository
          .ContentTypes(categoryResult.Id)
          .create({
            Name: content.Name,
            Description: content.Description,
            IconName: content.IconName || '',
            Styles: content.Style || '',
            IsDefault: true,
          });
      }
    }
    for (let index = 0; index < ROLES.length; index++) {
      const elm = ROLES[index];
      await this.roleRepository.create({
        Name: elm,
        Description: 'Note role',
      });
    }

    return VALIDATIONS_DEFAULT_DATA;
  }

  @authenticate('jwt')
  @get('/another/default-config')
  async defaultConfig(
    @inject('datasources.db') dataSource: DbDataSource,
  ): Promise<any[]> {
    const dataResult = dataSource.execute(`
      SELECT 
      ContentType.Id, 
      ContentType.Name as ContentTypeName, 
      IconName, 
      Styles, 
      ContentType.CategoryTypeId, 
      ContentType.Description as ContentTypeDescription,
      CategoryType.Name as CategoryTypeName,
      CategoryType.Description as CategoryTypeDescription
      FROM ContentType
      INNER JOIN CategoryType ON ContentType.CategoryTypeId = CategoryType.Id
      where ContentType.IsDefault = 1
    `);
    return dataResult;
  }

  @authenticate('jwt')
  @get('another/get-init-app-data', {
    responses: {
      // '200': {
      //   description: 'Array of Project model instances',
      //   content: {
      //     'application/json': {
      //       schema: {
      //         type: 'array',
      //         items: getModelSchemaRef(Project, {includeRelations: true}),
      //       },
      //     },
      //   },
      // },
    },
  })
  async getAllDataInitApp(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject('datasources.db') dataSource: DbDataSource,
  ): Promise<any> {
    const currentId = currentUserProfile[securityId].toLowerCase();
    const projectsByUserId = await dataSource.execute(`
      select 
      Project.Id,
      Project.Name,
      Project.Description,
      Project.CreatedAt,
      Project.UserCreatedId,
      Project.UrlImage
      from Project
      inner join ProjectMember on ProjectMember.ProjectId = Project.Id
      inner join UserRole on ProjectMember.UserRoleId = UserRole.Id
      where UserRole.UserId = '${currentId}'
    `);
    return {Projects: projectsByUserId};
  }
}
