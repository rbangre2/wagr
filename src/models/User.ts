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
  username?: string;
  pfpSource?: string;
}

// subcollection of User
export interface UserFriend {
  friendId: string;
  netResult: number;
}

export interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
  lastActive: string;
  netResult: number;
}
