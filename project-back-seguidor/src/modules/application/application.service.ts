import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';
import { CreateApplicationDto } from './application.dto';
import { Application } from 'src/entities/application.entity';
import { UserService } from '../users/users.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly appRepo: ApplicationRepository,
    private readonly userService: UserService,
  ) {}

  async getByEmail(email: string) {
    const res = this.appRepo.getByEmail(email);
    return res;
  }

  async createApp(appData: CreateApplicationDto) {
    const user = await this.userService.getById(appData.userId);

    const newData: Partial<Application> = {
      status: appData.status,
      position: appData.position,
      actions: appData.actions,
      comments: appData.comments,
      applicationDate: appData.applicationDate,
      recruiterName: appData.recruiterName,
      companyContact: appData.contactCompany,
      industry: appData.industry,
      applicationLink: appData.applicationLink,
      phoneScreen: appData.phoneScreen,
      firstInterview: appData.firstInterview,
      secondInterview: appData.secondInterview,
      thirdInterview: appData.thirdInterview,
      extraInterview: appData.additionalInterview,
      user, // Suponiendo que el DTO incluye userId
    };

    return await this.appRepo.createApplication(newData);
  }
}
