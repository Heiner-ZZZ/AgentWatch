import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuditService } from '../../audit/services/audit.service';
import { CredentialService } from '../../../common/security/services/credential.service';
import { AuthSessionsRepository } from '../../../infrastructure/database/repositories/auth-sessions.repository';
import { UsersRepository } from '../../../infrastructure/database/repositories/users.repository';
import { LoginDto } from '../dto/login.dto';
import { RefreshSessionDto } from '../dto/refresh-session.dto';
import { AuthSessionModel } from '../models/auth-session.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authSessionsRepository: AuthSessionsRepository,
    private readonly credentialService: CredentialService,
    private readonly auditService: AuditService,
  ) {}

  async login(
    payload: LoginDto,
    context?: { ipAddress?: string | null; userAgent?: string | null },
  ): Promise<AuthSessionModel> {
    const user = await this.usersRepository.findByEmail(payload.email);

    if (
      !user ||
      !this.credentialService.verifyHash(payload.password, user.passwordHash)
    ) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.credentialService.generateOpaqueToken('aw_session');
    const expiresAt = this.buildSessionExpiry();
    const session = await this.authSessionsRepository.create({
      userId: user.id,
      tokenHash: this.credentialService.hashValue(token),
      expiresAt,
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: 'auth.login',
      targetType: 'auth_session',
      targetId: session.id,
      afterState: {
        sessionId: session.id,
        expiresAt: expiresAt.toISOString(),
      },
      ipAddress: context?.ipAddress ?? null,
      userAgent: context?.userAgent ?? null,
    });

    return {
      token,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  async getSessionByToken(token: string) {
    const session = await this.authSessionsRepository.findByTokenHash(
      this.credentialService.hashValue(token),
    );

    if (!session) {
      return null;
    }

    const user = await this.usersRepository.findById(session.userId);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      sessionId: session.id,
      email: user.email,
      fullName: user.fullName,
      token,
    };
  }

  async logout(
    token: string,
    context?: { actorUserId?: string | null; ipAddress?: string | null; userAgent?: string | null },
  ) {
    const session = await this.authSessionsRepository.revokeByTokenHash(
      this.credentialService.hashValue(token),
    );

    if (!session) {
      return { revoked: false };
    }

    await this.auditService.record({
      actorUserId: context?.actorUserId ?? session.userId,
      action: 'auth.logout',
      targetType: 'auth_session',
      targetId: session.id,
      beforeState: {
        expiresAt: session.expiresAt.toISOString(),
      },
      afterState: {
        revokedAt: session.revokedAt?.toISOString() ?? new Date().toISOString(),
      },
      ipAddress: context?.ipAddress ?? null,
      userAgent: context?.userAgent ?? null,
    });

    return { revoked: true };
  }

  async refresh(
    payload: RefreshSessionDto,
    context?: { ipAddress?: string | null; userAgent?: string | null },
  ): Promise<AuthSessionModel> {
    const session = await this.authSessionsRepository.findByTokenHash(
      this.credentialService.hashValue(payload.refreshToken),
    );

    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.usersRepository.findById(session.userId);

    if (!user) {
      throw new UnauthorizedException('Session user not found.');
    }

    await this.authSessionsRepository.revokeByTokenHash(
      this.credentialService.hashValue(payload.refreshToken),
    );

    const token = this.credentialService.generateOpaqueToken('aw_session');
    const expiresAt = this.buildSessionExpiry();
    const newSession = await this.authSessionsRepository.create({
      userId: user.id,
      tokenHash: this.credentialService.hashValue(token),
      expiresAt,
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: 'auth.refresh',
      targetType: 'auth_session',
      targetId: newSession.id,
      beforeState: {
        previousSessionId: session.id,
      },
      afterState: {
        sessionId: newSession.id,
        expiresAt: expiresAt.toISOString(),
      },
      ipAddress: context?.ipAddress ?? null,
      userAgent: context?.userAgent ?? null,
    });

    return {
      token,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: newSession.createdAt.toISOString(),
      expiresAt: newSession.expiresAt.toISOString(),
    };
  }

  private buildSessionExpiry() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  }
}
