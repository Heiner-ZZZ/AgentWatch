import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { LoginDto } from '../dto/login.dto';
import { AuthSessionModel } from '../models/auth-session.model';

@Injectable()
export class AuthService {
  constructor(private readonly store: PlatformStoreService) {}

  login(payload: LoginDto): AuthSessionModel {
    const user = this.store.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === payload.email.toLowerCase() &&
        candidate.password === payload.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.store.generateToken('aw_session');
    const session = {
      token,
      userId: user.id,
      createdAt: this.store.now(),
    };

    this.store.sessions.push(session);

    return {
      token,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: session.createdAt,
    };
  }

  getSessionByToken(token: string) {
    const session = this.store.sessions.find((candidate) => candidate.token === token);

    if (!session) {
      return null;
    }

    const user = this.store.users.find((candidate) => candidate.id === session.userId);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      token: session.token,
    };
  }
}
