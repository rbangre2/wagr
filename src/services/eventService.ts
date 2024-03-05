import { db } from "@/utils/firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Event } from "@/models/Event";
import firebase from "firebase/compat/app";

export async function getEventById(eventId: string): Promise<Event | null> {
  const eventRef = doc(db, "events", eventId.toString());
  const eventSnapshot = await getDoc(eventRef);

  if (eventSnapshot.exists()) {
    return {
      ...eventSnapshot.data(),
      id: eventSnapshot.id,
    } as Event;
  } else {
    console.log("no event found");
    return null;
  }
}

export async function updateEventResult(
  eventId: string,
  score: string,
  result: string
): Promise<void> {
  const eventRef = doc(db, "events", eventId.toString());
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

    const now = firebase.firestore.Timestamp.now();

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
