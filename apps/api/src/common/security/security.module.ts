import { Global, Module } from '@nestjs/common';
import { CredentialService } from './services/credential.service';

@Global()
@Module({
  providers: [CredentialService],
  exports: [CredentialService],
})
export class SecurityModule {}
