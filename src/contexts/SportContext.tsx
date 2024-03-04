import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getEvents } from "@/services/sportsService";
import { determineMatchResult } from "@/utils/sportsUtils";
import { getResultForEvent } from "@/services/gameService";
import { updateEventResult } from "@/services/eventService"; // Use the correct function name
import { Event } from "@/models/Event";

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
    const resolveEventResults = async () => {
      const now = new Date();
      const pastEvents = events.filter(
        (event) => new Date(event.date) < now && event.status === "upcoming"
      );

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
      await resolveEventResults();
      const fetchedEvents = await getEvents();
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
