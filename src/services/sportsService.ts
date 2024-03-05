import { db } from "@/utils/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Event } from "@/models/Event";

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollectionRef = collection(db, "events");

    const eventSnapshot = await getDocs(eventsCollectionRef);
    const eventsList = eventSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Event;
    });
    return eventsList;
  } catch (error) {
    console.error("Error getting all events:", error);
    return [];
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollectionRef = collection(db, "events");

    const now = Timestamp.now();

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
    console.error("error getting events:", error);
    return [];
  }
};
