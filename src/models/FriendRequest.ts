export interface FriendRequest {
  id: string;
  sender: string;
  receiver: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
