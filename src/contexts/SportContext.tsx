import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getEvents, getAllEvents } from "@/services/sportsService";
import { determineMatchResult } from "@/utils/sportsUtils";
import { getResultForEvent } from "@/services/gameService";
import { updateEventResult } from "@/services/eventService"; // Use the correct function name
import { Event } from "@/models/Event";
import firebase from "firebase/firestore";

interface SportsContextType {
  events: Event[];
}

const SportsContext = createContext<SportsContextType | null>(null);

interface SportsProviderProps {
  children: ReactNode;
}

export const SportsProvider: React.FC<SportsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const resolveEventResults = async (fetchedEvents: Event[]) => {
      const now = new Date();
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

      const pastEvents = fetchedEvents.filter((fetchedEvent) => {
        const eventDate = new Date(
          (fetchedEvent.date as firebase.Timestamp).toDate()
        );
        console.log(`${eventDate} vs. ${fiveHoursAgo}`);
        return eventDate < fiveHoursAgo && fetchedEvent.status === "upcoming";
      });

      console.log(`number of past events: ${pastEvents.length}`);

      console.log(`number of past events: ${pastEvents.length}`);

      for (const event of pastEvents) {
        const ft_score = await getResultForEvent(event);
        if (ft_score) {
          const result = determineMatchResult(ft_score);
          await updateEventResult(event.id, ft_score, result);
        }
      }
    };

    const fetchEvents = async () => {
      const fetchedEvents = await getAllEvents();
      console.log(fetchedEvents);
      await resolveEventResults(fetchedEvents);
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  return (
    <SportsContext.Provider value={{ events }}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSportsContext = (): SportsContextType => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error("useSportsContext must be used within a SportsProvider");
  }
  return context;
};
