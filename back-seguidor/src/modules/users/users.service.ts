import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './user.dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getById(id: string) {
    const res = await this.userRepo.getUserById(id);
    return res;
  }

  async getAll() {
    const users = await this.userRepo.getAll();

    return users;
  }

  async create(userData: CreateUserDto) {
    const { email, name, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 11);

    const user = this.userRepo.createUser({
      email,
      name,
      password: hashedPassword,
    });
    return user;
  }

  async signin(email: string, password: string) {
    const { userData, token } = await this.userRepo.signin(email, password);

    return { userData, token };
  }
}
