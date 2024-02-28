export interface FriendRequest {
  id: string;
  senderName?: string;
  sender: string;
  receiver: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
