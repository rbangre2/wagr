import { db } from "@/utils/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Event } from "@/models/Event";

export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollectionRef = collection(db, "events");

    // Use the current timestamp to filter future events
    const now = Timestamp.now();

    // Create a query that selects events happening in the future
    const futureEventsQuery = query(
      eventsCollectionRef,
      where("date", ">", now)
    );

    const eventSnapshot = await getDocs(futureEventsQuery);
    const eventsList = eventSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Event;
    });
    return eventsList;
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};
