import { ConflictException, Injectable } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly store: PlatformStoreService) {}

  findAll(): UserModel[] {
    return this.store.users.map(({ password: _password, ...user }) => user);
  }

  create(payload: CreateUserDto): UserModel {
    const exists = this.store.users.some(
      (candidate) => candidate.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (exists) {
      throw new ConflictException('Email already exists.');
    }

    const now = this.store.now();
    const user = {
      id: this.store.generateId(),
      email: payload.email,
      fullName: payload.fullName,
      password: payload.password,
      status: payload.status,
      createdAt: now,
      updatedAt: now,
    };

    this.store.users.push(user);

    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
