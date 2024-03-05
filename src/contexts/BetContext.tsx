import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { db } from "@/utils/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { resolveBet } from "@/services/betService";
import { Bet } from "@/models/Bet";
import { Event } from "@/models/Event";

interface BetContextType {}

const BetContext = createContext<BetContextType | undefined>(undefined);

interface BetProviderProps {
  children: ReactNode;
}

export const BetProvider: React.FC<BetProviderProps> = ({ children }) => {
  useEffect(() => {
    const resolveBetsBasedOnEvents = async () => {
      // Fetch finished events
      const finishedEventsQuery = query(
        collection(db, "events"),
        where("status", "==", "finished")
      );
      const eventDocs = await getDocs(finishedEventsQuery);
      const finishedEvents: Event[] = eventDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));

      // Fetch "Accepted" bets
      const acceptedBetsQuery = query(
        collection(db, "bets"),
        where("status", "==", "Accepted")
      );
      const betDocs = await getDocs(acceptedBetsQuery);
      const acceptedBets: Bet[] = betDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Bet, "id">),
      }));

      // Resolve each bet
      for (const bet of acceptedBets) {
        const event = finishedEvents.find((e) => e.id === bet.eventId);
        if (event && event.result) {
          const outcome: "Won" | "Lost" = determineBetOutcome(
            bet,
            event.result
          );
          await resolveBet(bet.id, outcome);
        }
      }
    };

    resolveBetsBasedOnEvents();
  }, []);

  return <BetContext.Provider value={{}}>{children}</BetContext.Provider>;
};

export const useBetContext = (): BetContextType => {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error("useBetContext must be used within a BetProvider");
  }
  return context;
};

function determineBetOutcome(bet: Bet, eventResult: string): "Won" | "Lost" {
  if (
    (bet.senderSelection === "Home" && eventResult === "Win") ||
    (bet.senderSelection === "Away" && eventResult === "Lose")
  ) {
    return "Won";
  } else {
    return "Lost";
  }
}
