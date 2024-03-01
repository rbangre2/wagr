export interface Bet {
  id: string;
  eventId: string;
  status: "Pending" | "Accepted" | "Declined" | "Won" | "Lost";
  createdAt: Date;
  acceptedAt?: Date;
  resolvedAt?: Date;

  // Sender details
  senderId: string;
  senderName: string;
  senderSelection: string;
  senderOdds: number;
  senderStake: number;
  senderPotentialWin: number;

  // Receiver details before acceptance (calculated based on the bet terms)
  receiverId: string;
  receiverName: string;
  receiverStake: number;
  receiverOdds: number;
  receiverSelection: string;
  receiverPotentialWin: number;
}

export interface BetWithDetails {
  id: string;
  opponent: string;
  event: string;
  selection: string;
  staked: string;
  odds: string;
  potentialPayout: string;
  eventDate: string;
}
