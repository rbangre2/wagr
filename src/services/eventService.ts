import { db } from "@/utils/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
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
