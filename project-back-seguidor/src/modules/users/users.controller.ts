import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, SignInDto } from './user.dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    const users = await this.userService.getAll();
    return users;
  }

  @Post('/signup')
  async register(@Body() userData: CreateUserDto) {
    const res = await this.userService.create(userData);
    return res;
  }

  @Post('/signin')
  async signin(@Body() userData: SignInDto) {
    const { password, email } = userData;
    const res = await this.userService.signin(email, password);
    return res;
  }

  @Get('/:id')
  async getById(@Param('id') userID: string) {
    const res = await this.userService.getById(userID);
    return res;
  }
}
