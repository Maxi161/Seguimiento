import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const userFound = await this.userRepo.findOne({ where: { email } });

    if (!userFound) {
      throw new HttpException({ status: 404, error: 'user not found' }, 404);
    }

    const applications = await this.appRepo.find({
      where: { user: userFound },
    });

    if (!applications) {
      throw new HttpException(
        { status: 404, error: 'this user dont has applications' },
        404,
      );
    }

    return applications;
  }

  async createApplication(appData: Partial<Application>) {
    await this.appRepo.save(appData);
    const allApps = await this.appRepo.find({ where: { user: appData.user } });

    return allApps;
  }

  async updateApp(app: Partial<Application>) {
    const newApp = await this.appRepo.save(app);
    console.log(app);
    return newApp;
  }
}
