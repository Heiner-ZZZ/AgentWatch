import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CredentialService {
  hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  verifyHash(value: string, hashedValue: string) {
    return this.hashValue(value) === hashedValue;
  }

  generateOpaqueToken(prefix: string) {
    return `${prefix}_${randomBytes(16).toString('hex')}`;
  }

  getKeyPrefix(token: string) {
    return token.slice(0, 12);
  }

  getMaskedToken(token: string) {
    return `${this.getKeyPrefix(token)}...`;
  }
}
