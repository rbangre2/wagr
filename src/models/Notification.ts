export enum ActivityType {
  NEW_FRIEND_REQUEST = "new_friend_request",
  FRIEND_REQUEST_ACCEPTED = "friend_request_accepted",
  NEW_BET_CHALLENGE = "new_bet_challenge",
  BET_CHALLENGE_ACCEPTED = "bet_challenge_accepted",
  MARKET_ORDER_FILLED = "market_order_filled",
  ORDER_PARTIALLY_FILLED = "order_partially_filled",
}

export interface Notification {
  id: string;
  type: ActivityType;
  message: string;
  read: boolean;
  date: Date;
}
