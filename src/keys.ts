import {BindingKey} from '@loopback/core';
import {UserService} from './services/user.service';

export namespace CustomServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService>('services.User');
  export const UTILITIES_SERVICE = BindingKey.create('services.utilities');
}
