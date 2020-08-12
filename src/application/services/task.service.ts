import {inject} from '@loopback/context';
import {repository, juggler} from '@loopback/repository';
import {ObjectId} from 'mongodb';
import {HttpErrors} from '@loopback/rest';
import * as _ from 'lodash';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {TagRepository} from '../../infrastructure/repositories/tag.repository';

export class MealService {
  constructor(
    @inject('datasources.db') protected dataSource: juggler.DataSource,

    @repository(TagRepository)
    private tagRepo: TagRepository,

    @inject(SecurityBindings.USER, {optional: true})
    private currentAuthUserProfile: UserProfile,
  ) {}
}
