export interface IApplication {
  id?: string;
  status: string;
  position: string;
  actions: string;
  comments: string;
  applicationDate: Date | undefined;
  recruiterName: string;
  companyContact: string;
  industry: string;
  applicationLink: string;
  platform: string;
  company: string;
  phoneScreen: Date | undefined;
  firstInterview: Date | undefined;
  secondInterview: Date | undefined;
  thirdInterview: Date | undefined;
  extraInterview: Date | undefined;
  userId: string;
}

export interface IParsedApplication {
  id: string;
  status: string;
  position: string;
  actions: string;
  comments: string;
  applicationDate: string | undefined;
  recruiterName: string;
  companyContact: string;
  industry: string;
  applicationLink: string;
  company: string;
  platform: string;
  phoneScreen: string | undefined;
  firstInterview: string | undefined;
  secondInterview: string | undefined;
  thirdInterview: string | undefined;
  extraInterview: string | undefined;
  userId: string;
}
