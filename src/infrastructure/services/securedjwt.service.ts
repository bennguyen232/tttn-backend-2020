import {promisify} from 'util';
import {Secret, SignOptions, VerifyOptions} from 'jsonwebtoken';

const jwt = require('jsonwebtoken');

export class SecuredJwtService {
  // sign async
  async signAsync(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ): Promise<string> {
    return promisify(jwt.sign)(payload, secretOrPrivateKey, options);
  }

  // verify async
  async verifyAsync(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions,
  ): Promise<object | string> {
    return promisify(jwt.verify)(token, secretOrPublicKey, options);
  }
}
