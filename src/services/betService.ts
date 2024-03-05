import { Bet } from "@/models/Bet";
import { db } from "@/utils/firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
  writeBatch,
  increment,
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
export async function resolveBet(
  betId: string,
  outcome: "Won" | "Lost"
): Promise<void> {
  const betRef = doc(db, "bets", betId);
  try {
    // Begin a batched write to ensure atomic operations
    const batch = writeBatch(db);

    // Fetch the bet details
    const betSnap = await getDoc(betRef);
    if (!betSnap.exists()) {
      throw new Error(`No bet found with the ID: ${betId}`);
    }
    const betData = betSnap.data() as Bet;

    // Update the bet status and resolved time
    batch.update(betRef, {
      status: "Resolved",
      result: outcome,
      resolvedAt: new Date(),
    });

    // Determine the winning and losing amounts and users
    let winnerId: string, loserId: string, amount: number;
    if (outcome === "Won") {
      winnerId = betData.senderId;
      loserId = betData.receiverId;
      amount = betData.senderPotentialWin;
    } else {
      winnerId = betData.receiverId;
      loserId = betData.senderId;
      amount = betData.receiverPotentialWin;
    }

    // Fetch both user documents
    const winnerRef = doc(db, "users", winnerId);
    const loserRef = doc(db, "users", loserId);

    // Deposit the winnings to the winner
    batch.update(winnerRef, {
      balance: increment(amount),
    });

    // Deduct the stake from the loser
    batch.update(loserRef, {
      balance: increment(-amount),
    });

    // Commit the batch
    await batch.commit();
    console.log(
      `Bet ${betId} resolved as ${outcome}, users' balances updated.`
    );
  } catch (error) {
    console.error("Error resolving bet: ", error);
    throw error;
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

export async function getResolvedBetsByUserId(userId: string): Promise<Bet[]> {
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
    console.error("error getting resolved bets by user id: ", error);
    return [];
  }
}
