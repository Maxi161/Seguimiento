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
  phoneScreen: string;
  firstInterview: Date | undefined;
  secondInterview: Date | undefined;
  thirdInterview: Date | undefined;
  extraInterview: Date | undefined;
  userId: string;
}
