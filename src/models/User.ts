export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  balance: number;
  friends: string[];
  lastActive: Date;
  createdAt?: Date;
}

interface Friend extends User {
  netResult: number; // for the friens table
}
