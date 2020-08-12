import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
  EVERYONE,
  UNAUTHENTICATED,
} from '@loopback/authorization';
import * as _ from 'lodash';
import {Principal, securityId} from '@loopback/security';
import {AccountRepository} from '../../infrastructure/repositories';
import {Account} from '../../domain/models/account.model';

export class RbacAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(AccountRepository) public accountRepository: AccountRepository,
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    // This is to ensure the API is not publicly exposed by default when
    // when developers forget to set authorization for APIs.
    // If there is no roles allowed, then the access is denied by default!
    if (!metadata.allowedRoles) {
      return AuthorizationDecision.DENY;
    }

    if (metadata.allowedRoles.includes(EVERYONE)) {
      return AuthorizationDecision.ALLOW;
    }

    const principal: Principal = _.get(authorizationCtx, 'principals[0]');
    const userId = principal && principal[securityId];

    if (!userId) {
      if (metadata.allowedRoles.includes(UNAUTHENTICATED)) {
        return AuthorizationDecision.ALLOW;
      }

      return AuthorizationDecision.DENY;
    }

    const user: Account = await this.accountRepository.findById(userId);

    // Grant access when one of user's roles is allowed.
    if (_.intersection(metadata.allowedRoles, [user.role]).length >= 0) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}
