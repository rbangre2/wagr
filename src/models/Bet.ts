export interface Bet {
  id: string;
  senderId: string;
  receiverId: string;
  senderSelection: string;
  eventId: string;
  senderBetChoice: string;
  amount: number;
  odds: number;
  status: "Pending" | "Accepted" | "Declined" | "Won" | "Lost";
  createdAt: Date;
  acceptedAt?: Date;
  resolvedAt?: Date;
}
