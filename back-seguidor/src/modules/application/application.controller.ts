import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './application.dto';
import { Application } from 'src/entities/application.entity';
import { TokenGuard } from 'src/guards/token.guard';
import { User } from 'src/entities/user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/helpers/roles.enum';

@Controller('application')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @UseGuards(TokenGuard)
  @Post()
  async createApp(@Body() data: CreateApplicationDto) {
    const res = await this.appService.createApp(data);
    return res;
  }

  @UseGuards(TokenGuard)
  @Put()
  async updateApp(@Body() app: Partial<Application>) {
    try {
      const res = await this.appService.updateApp(app);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(TokenGuard)
  @Roles(Role.COACH)
  @Get('/:email')
  async getById(
    @Param('email') email: string,
    @Body('user') user: Partial<User>,
  ) {
    console.log(user);
    const res = await this.appService.getByEmail(email);
    return res;
  }
}
