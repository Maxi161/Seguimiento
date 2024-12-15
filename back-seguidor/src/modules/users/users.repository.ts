import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAll() {
    const users = await this.userRepo.find({
      select: ['email', 'id', 'role', 'name'],
      relations: ['applications'],
    });
    return users;
  }

  async getUserById(id: string) {
    const found = await this.userRepo.findOne({
      where: { id },
    });

    if (!found) {
      throw new HttpException(
        {
          status: 400,
          error: 'user not found',
        },
        400,
      );
    }

    return found;
  }

  async createUser(userData: Partial<CreateUserDto>) {
    const found = await this.userRepo.findOne({
      where: { email: userData.email },
    });

    if (found) {
      throw new HttpException(
        {
          status: 400,
          error: 'email is already in use',
        },
        400,
      );
    }

    const user: Partial<User> = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };

    const newUser = await this.userRepo.save(user);

    const newUserData = await this.userRepo.findOne({
      where: { email: newUser.email },
      select: ['receivedMessages', 'applications', 'name', 'id', 'email'],
      relations: ['applications'],
    });

    return newUserData;
  }

  async signin(email: string, password: string) {
    const userFound = await this.userRepo.findOne({ where: { email } });

    if (!userFound) {
      throw new HttpException({ status: 404, error: 'user not found' }, 404);
    }

    const verify = await bcrypt.compare(password, userFound.password);

    if (!verify) {
      throw new HttpException({ status: 401, error: 'Unauthorized' }, 401);
    }

    const userData = await this.userRepo.findOne({
      where: { email },
      select: ['email', 'id', 'name', 'role', 'applications'],
      relations: ['applications'],
      order: {
        applications: {
          applicationDate: 'ASC', // Ordena las aplicaciones por fecha ascendente
        },
      },
    });

    const payload = {
      sub: userFound.id,
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };

    const token = this.jwtService.sign(payload);

    return { userData, token };
  }
}
