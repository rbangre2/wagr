import { Bet } from "@/models/Bet";
import { db } from "@/utils/firebase/firebaseConfig";
import { BetWithDetails } from "@/models/Bet";
import { getEventById } from "./eventService";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";

interface BetCreationData
  extends Omit<Bet, "id" | "acceptedAt" | "resolvedAt"> {}

export async function createBet(betData: BetCreationData): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "bets"), {
      ...betData,
      createdAt: new Date(),
      status: "Pending",
    });
    console.log("bet created with id: ", docRef.id);
  } catch (error) {
    console.error("error creating new bet: ", error);
  }
}

export async function acceptBet(betId: string) {
  const betRef = doc(db, "bets", betId);
  try {
    await updateDoc(betRef, {
      status: "Accepted",
      acceptedAt: new Date(),
    });
    console.log("bet accepted!");
  } catch (error) {
    console.error("error accepting bet: ", error);
  }
}

export async function declineBet(betId: string) {
  const betRef = doc(db, "bets", betId);
  try {
    await updateDoc(betRef, {
      status: "Declined",
    });
    console.log("bet declined");
  } catch (error) {
    console.error("error declining bet: ", error);
  }
}

export async function getBetById(betId: string): Promise<Bet | null> {
  try {
    const betRef = doc(db, "bets", betId);
    const betSnapshot = await getDoc(betRef);

    if (betSnapshot.exists()) {
      return {
        ...(betSnapshot.data() as Bet),
        id: betSnapshot.id,
      };
    } else {
      console.log("bet not found: ", betId);
      return null;
    }
  } catch (error) {
    console.error("error fetching bet: ", error);
    return null;
  }
}

export async function getIncomingBetsByUserId(
  userId: string | undefined
): Promise<BetWithDetails[]> {
  if (!userId) {
    return [];
  }
  try {
    const betsRef = collection(db, "bets");
    const incomingBetsQuery = query(
      betsRef,
      where("receiverId", "==", userId),
      where("status", "==", "Pending")
    );

    const querySnapshot = await getDocs(incomingBetsQuery);
    const incomingBets = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));

    const betsWithDetails: (BetWithDetails | undefined)[] = await Promise.all(
      incomingBets.map(async (bet) => {
        const event = await getEventById(bet.eventId);
        if (event) {
          const homeWin = event.result === "Win";
          const senderOutcome =
            (homeWin && bet.senderSelection === event.homeTeam) ||
            (!homeWin && bet.senderSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          // Determine the outcome for the receiver
          const receiverOutcome =
            (homeWin && bet.receiverSelection === event.homeTeam) ||
            (!homeWin && bet.receiverSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          if (userId === bet.senderId) {
            const senderBet: BetWithDetails = {
              id: bet.id,
              opponent: bet.receiverName,
              event: `${event.homeTeam} vs. ${event?.awayTeam}`,
              selection: bet.senderSelection,
              staked: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderStake),
              odds: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(bet.senderOdds),
              potentialPayout: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderPotentialWin),
              eventDate: new Date((event.date as any).toDate()).toDateString(),
              outcome: senderOutcome,
              net_result: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                senderOutcome === "WIN"
                  ? bet.senderPotentialWin - bet.senderStake
                  : -1 * bet.senderStake
              ),
            };
            return senderBet;
          }
          const receiverBet: BetWithDetails = {
            id: bet.id,
            opponent: bet.senderName,
            event: `${event?.homeTeam} vs. ${event?.awayTeam}`,
            selection: bet.receiverSelection,
            staked: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverStake),
            odds: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(bet.receiverOdds),
            potentialPayout: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverPotentialWin),
            eventDate: new Date((event.date as any).toDate()).toDateString(),
            outcome: receiverOutcome,
            net_result: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(
              senderOutcome === "WIN"
                ? bet.senderPotentialWin - bet.senderStake
                : -1 * bet.senderStake
            ),
          };
          return receiverBet;
        }
      })
    );

    return betsWithDetails.filter((bet): bet is BetWithDetails => bet !== null);
  } catch (error) {
    console.error("error getting incoming bets by user ID: ", error);
    return [];
  }
}

// Adjusted function to return BetWithDetails[]
export async function getBetsByUserId(
  userId: string | undefined
): Promise<BetWithDetails[]> {
  if (!userId) {
    return [];
  }
  try {
    const betsRef = collection(db, "bets");
    const sentBetsQuery = query(
      betsRef,
      where("senderId", "==", userId),
      where("status", "==", "Accepted")
    );
    const receivedBetsQuery = query(
      betsRef,
      where("receiverId", "==", userId),
      where("status", "==", "Accepted")
    );

    const sentBetsQuerySnapshot = await getDocs(sentBetsQuery);
    const sentBets: Bet[] = sentBetsQuerySnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));

    const receivedBetsQuerySnapshot = await getDocs(receivedBetsQuery);
    const receivedBets: Bet[] = receivedBetsQuerySnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));

    const bets = [...sentBets, ...receivedBets];

    const betsWithDetails: (BetWithDetails | undefined)[] = await Promise.all(
      bets.map(async (bet) => {
        const event = await getEventById(bet.eventId);
        if (event) {
          const homeWin = event.result === "Win";
          const senderOutcome =
            (homeWin && bet.senderSelection === event.homeTeam) ||
            (!homeWin && bet.senderSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          // Determine the outcome for the receiver
          const receiverOutcome =
            (homeWin && bet.receiverSelection === event.homeTeam) ||
            (!homeWin && bet.receiverSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          if (userId === bet.senderId) {
            const senderBet: BetWithDetails = {
              id: bet.id,
              opponent: bet.receiverName,
              event: `${event.homeTeam} vs. ${event?.awayTeam}`,
              selection: bet.senderSelection,
              staked: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderStake),
              odds: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(bet.senderOdds),
              potentialPayout: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderPotentialWin),
              eventDate: new Date((event.date as any).toDate()).toDateString(),
              outcome: senderOutcome,
              net_result: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                senderOutcome === "WIN"
                  ? bet.senderPotentialWin - bet.senderStake
                  : -1 * bet.senderStake
              ),
            };
            return senderBet;
          }
          const receiverBet: BetWithDetails = {
            id: bet.id,
            opponent: bet.senderName,
            event: `${event?.homeTeam} vs. ${event?.awayTeam}`,
            selection: bet.receiverSelection,
            staked: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverStake),
            odds: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(bet.receiverOdds),
            potentialPayout: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverPotentialWin),
            eventDate: new Date((event.date as any).toDate()).toDateString(),
            outcome: receiverOutcome,
            net_result: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(
              senderOutcome === "WIN"
                ? bet.senderPotentialWin - bet.senderStake
                : -1 * bet.senderStake
            ),
          };
          return receiverBet;
        }
      })
    );

    return betsWithDetails.filter((bet): bet is BetWithDetails => bet !== null);
  } catch (error) {
    console.error("error getting bets by user ID: ", error);
    return [];
  }
}

export async function getOutgoingBetsByUserId(
  userId: string | undefined
): Promise<BetWithDetails[]> {
  try {
    const betsRef = collection(db, "bets");
    const outgoingBetsQuery = query(
      betsRef,
      where("senderId", "==", userId),
      where("status", "==", "Pending")
    );

    const querySnapshot = await getDocs(outgoingBetsQuery);
    const outgoingBets = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));

    const betsWithDetails: (BetWithDetails | undefined)[] = await Promise.all(
      outgoingBets.map(async (bet) => {
        const event = await getEventById(bet.eventId);
        if (event) {
          const homeWin = event.result === "Win";
          const senderOutcome =
            (homeWin && bet.senderSelection === event.homeTeam) ||
            (!homeWin && bet.senderSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          // Determine the outcome for the receiver
          const receiverOutcome =
            (homeWin && bet.receiverSelection === event.homeTeam) ||
            (!homeWin && bet.receiverSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          if (userId === bet.senderId) {
            const senderBet: BetWithDetails = {
              id: bet.id,
              opponent: bet.receiverName,
              event: `${event.homeTeam} vs. ${event?.awayTeam}`,
              selection: bet.senderSelection,
              staked: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderStake),
              odds: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(bet.senderOdds),
              potentialPayout: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderPotentialWin),
              eventDate: new Date((event.date as any).toDate()).toDateString(),
              outcome: senderOutcome,
              net_result: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                senderOutcome === "WIN"
                  ? bet.senderPotentialWin - bet.senderStake
                  : -1 * bet.senderStake
              ),
            };
            return senderBet;
          }
          const receiverBet: BetWithDetails = {
            id: bet.id,
            opponent: bet.senderName,
            event: `${event?.homeTeam} vs. ${event?.awayTeam}`,
            selection: bet.receiverSelection,
            staked: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverStake),
            odds: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(bet.receiverOdds),
            potentialPayout: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverPotentialWin),
            eventDate: new Date((event.date as any).toDate()).toDateString(),
            outcome: receiverOutcome,
            net_result: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(
              senderOutcome === "WIN"
                ? bet.senderPotentialWin - bet.senderStake
                : -1 * bet.senderStake
            ),
          };
          return receiverBet;
        }
      })
    );

    return betsWithDetails.filter((bet): bet is BetWithDetails => bet !== null);
  } catch (error) {
    console.error("error getting outgoing bets by user ID: ", error);
    return [];
  }
}

export async function getResolvedBetsByUserId(
  userId: string | undefined
): Promise<BetWithDetails[]> {
  if (!userId) {
    return [];
  }
  try {
    const betsRef = collection(db, "bets");
    const resolvedBetsQuery = query(
      betsRef,
      where("status", "==", "Resolved"),
      where("senderId", "==", userId)
    );
    const resolvedBetsQueryReceiver = query(
      betsRef,
      where("status", "==", "Resolved"),
      where("receiverId", "==", userId)
    );

    const [sentBetsSnapshot, receivedBetsSnapshot] = await Promise.all([
      getDocs(resolvedBetsQuery),
      getDocs(resolvedBetsQueryReceiver),
    ]);

    const bets = [...sentBetsSnapshot.docs, ...receivedBetsSnapshot.docs].map(
      (doc) => ({ ...(doc.data() as Bet), id: doc.id })
    );

    const betsWithDetails: (BetWithDetails | undefined)[] = await Promise.all(
      bets.map(async (bet) => {
        const event = await getEventById(bet.eventId);
        if (event) {
          const homeWin = event.result === "Win";
          const senderOutcome =
            (homeWin && bet.senderSelection === event.homeTeam) ||
            (!homeWin && bet.senderSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          // Determine the outcome for the receiver
          const receiverOutcome =
            (homeWin && bet.receiverSelection === event.homeTeam) ||
            (!homeWin && bet.receiverSelection === event.awayTeam)
              ? "WIN"
              : "LOST";
          if (userId === bet.senderId) {
            const senderBet: BetWithDetails = {
              id: bet.id,
              opponent: bet.receiverName,
              event: `${event.homeTeam} vs. ${event?.awayTeam}`,
              selection: bet.senderSelection,
              staked: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderStake),
              odds: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(bet.senderOdds),
              potentialPayout: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.senderPotentialWin),
              eventDate: new Date((event.date as any).toDate()).toDateString(),
              outcome: senderOutcome,
              net_result: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                senderOutcome === "WIN"
                  ? bet.senderPotentialWin - bet.senderStake
                  : -1 * bet.senderStake
              ),
            };
            return senderBet;
          }
          const receiverBet: BetWithDetails = {
            id: bet.id,
            opponent: bet.senderName,
            event: `${event?.homeTeam} vs. ${event?.awayTeam}`,
            selection: bet.receiverSelection,
            staked: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverStake),
            odds: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(bet.receiverOdds),
            potentialPayout: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(bet.receiverPotentialWin),
            eventDate: new Date((event.date as any).toDate()).toDateString(),
            outcome: receiverOutcome,
            net_result: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(
              senderOutcome === "WIN"
                ? bet.senderPotentialWin - bet.senderStake
                : -1 * bet.senderStake
            ),
          };
          return receiverBet;
        }
      })
    );

    return betsWithDetails.filter((bet): bet is BetWithDetails => bet !== null);
  } catch (error) {
    console.error("Error getting resolved bets by user ID: ", error);
    return [];
  }
}