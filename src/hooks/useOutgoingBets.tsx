import { useQuery } from "react-query";
import { getOutgoingBetsByUserId } from "@/services/betService";

export function useOutgoingBets(userId: string | undefined) {
  return useQuery(
    ["outgoingBets", userId],
    () => getOutgoingBetsByUserId(userId),
    {
      enabled: !!userId,
    }
  );
}
