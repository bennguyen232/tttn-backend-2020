import {authenticate, TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository, FilterExcludingWhere} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, param} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials, UserService} from '../services/user.service';
import {CustomServiceBindings} from '../keys';

const CredentialsSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(CustomServiceBindings.USER_SERVICE)
    public userService: UserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    try {
      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);
      return {token};
    } catch (error) {
      return {token: ''};
    }
  }

  @authenticate('jwt')
  @get('users/who-am-i', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['Id'],
          }),
        },
      },
    })
    newUserRequest: User,
  ): Promise<User> {
    const password = await hash(newUserRequest.Password, await genSalt());
    Object.assign(newUserRequest, {Password: password});
    console.log({newUserRequest});
    const savedUser = await this.userRepository.create(newUserRequest);
    return savedUser;
  }

  @authenticate('jwt')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'ContentType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<User> {
    const _id = id === 'me' ? currentUserProfile[securityId] : id;
    return this.userRepository.findById(_id);
  }

  @authenticate('jwt')
  @post('users/{id}/role/{roleId}', {
    responses: {
      '200': {
        description: 'User add role',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async addRoleById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @param.path.string('roleId') roleId: string,
  ): Promise<User> {
    // const password = await hash(newUserRequest.Password, await genSalt());
    // Object.assign(newUserRequest, {Password: password});
    // console.log({newUserRequest});
    // const savedUser = await this.userRepository.create(newUserRequest);
    // return savedUser;
    return {} as User;
  }

}
