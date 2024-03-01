import { Bet } from "@/models/Bet";
import { db } from "@/utils/firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
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

// more work to be done with managing user balances
export async function resolveBet(betId: string, outcome: "Won" | "Lost") {
  const betRef = doc(db, "bets", betId);
  try {
    await updateDoc(betRef, {
      status: outcome,
      resolvedAt: new Date(),
    });
    console.log(`bet resolved as ${outcome}`);
  } catch (error) {
    console.error("error resolving bet: ", error);
  }
}

export async function getBetsByUserId(userId: string): Promise<Bet[]> {
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

    const sentBetsSnapshot = await getDocs(sentBetsQuery);
    const receivedBetsSnapshot = await getDocs(receivedBetsQuery);

    const sentBets = sentBetsSnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));
    const receivedBets = receivedBetsSnapshot.docs.map((doc) => ({
      ...(doc.data() as Bet),
      id: doc.id,
    }));

    return [...sentBets, ...receivedBets];
  } catch (error) {
    console.error("error getting bets by user ID: ", error);
    return [];
  }
}

export async function getIncomingBetsByUserId(userId: string): Promise<Bet[]> {
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

    return incomingBets;
  } catch (error) {
    console.error("error getting incoming bets by user ID: ", error);
    return [];
  }
}

export async function getOutgoingBetsByUserId(userId: string): Promise<Bet[]> {
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

    return outgoingBets;
  } catch (error) {
    console.error("error getting outgoing bets by user ID: ", error);
    return [];
  }
}
