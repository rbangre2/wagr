import { Bet } from "@/models/Bet";
import { db } from "@/utils/firebase/firebaseConfig";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";

export async function createBet(
  bet: Omit<Bet, "id" | "acceptedAt" | "resolvedAt">
) {
  try {
    const docRef = await addDoc(collection(db, "bets"), {
      ...bet,
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
    console.log("bet accepted");
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
    console.log("Bet declined");
  } catch (error) {
    console.error("Error declining bet: ", error);
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
    console.log(`Bet resolved as ${outcome}`);
  } catch (error) {
    console.error("Error resolving bet: ", error);
  }
}
