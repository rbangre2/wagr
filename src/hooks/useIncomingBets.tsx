import { useQuery } from "react-query";
import { getIncomingBetsByUserId } from "@/services/betService";

export function useIncomingBets(userId: string | undefined) {
  return useQuery(
    ["incomingBets", userId],
    () => getIncomingBetsByUserId(userId),
    {
      enabled: !!userId,
    }
  );
}
