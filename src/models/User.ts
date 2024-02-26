export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  balance: number;
  createdAt?: Date;
}
