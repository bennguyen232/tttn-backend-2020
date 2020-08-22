import {UserService as UserServiceAuth} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
// User --> MyUser
import {User as MyUser, Role} from '../models';
// UserRepository --> MyUserRepository
import {UserRepository as MyUserRepository} from '../repositories';
import {INVALID_CREDENTIAL_ERROR} from '../constants';

export type Credentials = {
  username: string;
  password: string;
};

// User --> MyUser
export class UserService implements UserServiceAuth<MyUser, Credentials> {
  constructor(
    // UserRepository --> MyUserRepository
    @repository(MyUserRepository) public userRepository: MyUserRepository,
  ) {}

  // User --> MyUser
  async verifyCredentials(credentials: Credentials): Promise<MyUser> {
    const foundUser = await this.userRepository.findOne({
      where: {Username: credentials.username},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(INVALID_CREDENTIAL_ERROR);
    }

    const passwordMatched = await compare(
      credentials.password,
      foundUser.Password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(INVALID_CREDENTIAL_ERROR);
    }

    return foundUser;
  }

  // User --> MyUser
  convertToUserProfile(user: MyUser): UserProfile {
    return {
      [securityId]: user.Id.toString(),
      name: user.Username,
      id: user.Id,
      email: user.Username,
    };
  }

  addRoleById(): Role {
    return {} as Role;
  }
}
