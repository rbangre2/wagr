import { useQuery } from "react-query";
import { getBetsByUserId } from "@/services/betService";

export function useBets(userId: string | undefined) {
  return useQuery(["bets", userId], () => getBetsByUserId(userId), {
    enabled: !!userId,
  });
}
