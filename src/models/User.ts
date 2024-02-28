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

// subcollection of User
export interface Friend {
  friendId: string;
  netResult: number;
}
