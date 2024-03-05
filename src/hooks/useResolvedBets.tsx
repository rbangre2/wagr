// src/hooks/useIncomingBets.js
import { useQuery } from "react-query";
import { getResolvedBetsByUserId } from "@/services/betService";

export function useResolvedBets(userId: string | undefined) {
  return useQuery(
    ["resolvedBets", userId],
    () => getResolvedBetsByUserId(userId),
    {
      enabled: !!userId,
    }
  );
}
