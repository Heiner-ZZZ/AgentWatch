import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialService } from '../../security/services/credential.service';
import { ApiKeysRepository } from '../../../infrastructure/database/repositories/api-keys.repository';

@Injectable()
export class AgentApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysRepository: ApiKeysRepository,
    private readonly credentialService: CredentialService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing agent API key.');
    }

    const apiKey = authorization.replace('Bearer ', '').trim();
    const keyPrefix = this.credentialService.getKeyPrefix(apiKey);
    const keyHash = this.credentialService.hashValue(apiKey);
    const keyRecord = await this.apiKeysRepository.findActiveByPrefixAndHash(
      keyPrefix,
      keyHash,
    );

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid or inactive agent API key.');
    }

    request.agentKey = {
      agentId: keyRecord.agentId,
      organizationId: keyRecord.organizationId,
    };

    return true;
  }
}
