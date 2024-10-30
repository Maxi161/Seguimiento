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
