import { db } from "@/utils/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Event } from "@/models/Event";

export async function getEventById(eventId: string): Promise<Event | null> {
  const eventRef = doc(db, "events", eventId.toString());
  const eventSnapshot = await getDoc(eventRef);

  if (eventSnapshot.exists()) {
    return {
      ...eventSnapshot.data(),
      id: eventSnapshot.id,
    } as Event;
  } else {
    console.error("event not found");
    return null;
  }
}

export async function updateEventResult(
  eventId: string,
  score: string,
  result: string
): Promise<void> {
  const eventRef = doc(db, "events", eventId);
  try {
    await updateDoc(eventRef, {
      score,
      result,
      status: "finished",
    });
    console.log(
      `event ${eventId} updated with result: ${result} and score: ${score}`
    );
  } catch (error) {
    console.error(`error updating event ${eventId}:`, error);
    throw error;
  }
}
