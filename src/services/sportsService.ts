import { db } from "@/utils/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Event } from "@/models/Event";

export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollectionRef = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCollectionRef);
    const eventsList = eventSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Event;
    });
    console.log(eventsList);
    return eventsList;
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};
