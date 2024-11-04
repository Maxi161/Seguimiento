import { IsDate, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  status: string;

  @IsString()
  position: string;

  @IsString()
  actions: string;

  @IsString()
  comments: string;

  @IsDate()
  applicationDate: Date;

  // Contact information fields
  @IsString()
  recruiterName: string;

  @IsString()
  company: string;

  @IsString()
  companyContact: string;

  @IsString()
  industry: string;

  @IsUrl()
  applicationLink: string;

  // Interview fields (optional)
  @IsOptional()
  @IsDate()
  phoneScreen?: Date;

  @IsString()
  platform: string;

  @IsOptional()
  @IsDate()
  firstInterview?: Date;

  @IsOptional()
  @IsDate()
  secondInterview?: Date;

  @IsOptional()
  @IsDate()
  thirdInterview?: Date;

  @IsOptional()
  @IsDate()
  additionalInterview?: Date;

  // Relationship to user
  @IsUUID()
  userId: string;
}
