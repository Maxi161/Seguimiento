export interface IFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IApplicationFormErrors {
  id?: string;
  status?: string;
  position?: string;
  actions?: string;
  comments?: string;
  applicationDate?: string;
  recruiterName?: string;
  companyContact?: string;
  industry?: string;
  applicationLink?: string;
  phoneScreen?: string;
  firstInterview?: string;
  secondInterview?: string;
  thirdInterview?: string;
  extraInterview?: string;
  userId?: string;
}
