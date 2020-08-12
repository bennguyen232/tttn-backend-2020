import * as validator from 'validator';
import {model, property, hasMany} from '@loopback/repository';
import {TimestampEntity} from '../mixin/timestamp.mixin';

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(providedPass: string, storedPass: string): Promise<boolean>;
}

export namespace AccountConstraint {
  export const PASSWORD_MIN_LENGTH = 6;
  export const PASSWORD_MAX_LENGTH = 24;
  export const PARTIAL_NAME_MAX_LENGTH = 300;
}

export enum Role {
  ROOT_ADMIN = 'root_admin',
  USER = 'user',
}

export enum AccountStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export namespace UserValidator {
  export function isResetPasswordPayloadValid({
    newPassword,
    oldPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    return isValidPassword(oldPassword) && oldPassword === newPassword;
  }

  export function isValidEmail(email: string) {
    return validator.isEmail(email);
  }

  export function isValidPassword(password: string) {
    return (
      password !== '' &&
      password.length >= AccountConstraint.PASSWORD_MIN_LENGTH &&
      password.length <= AccountConstraint.PASSWORD_MAX_LENGTH
    );
  }
}

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
    hiddenProperties: ['password', 'authPayloadHash'],
  },
})
export class Account extends TimestampEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({type: 'string'})
  role: Role;

  @property({type: 'string'})
  authPayloadHash: string;

  @property({type: 'string'})
  firstName: string;

  @property({type: 'string'})
  lastName: string;

  @property({type: 'string'})
  status: AccountStatus;

  @property({type: 'boolean'})
  emailVerified: boolean;

  @property({type: 'string'})
  imageUrl?: string;

  // @hasMany(() => MealProfile)
  // mealProfiles?: MealProfile[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // mealProfiles?: MealWithRelations[];
}

export type AccountWithRelations = Account & AccountRelations;
