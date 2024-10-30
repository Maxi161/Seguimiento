import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post('/')
  async createApp(@Body() data: CreateApplicationDto) {
    const res = await this.appService.createApp(data);
    return res;
  }

  @Get('/:email')
  async getById(@Param('email') email: string) {
    const res = await this.appService.getByEmail(email);
    return res;
  }
}
