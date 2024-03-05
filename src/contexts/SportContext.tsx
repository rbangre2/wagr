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
    const fetchEvents = async () => {
      const fetchedEvents = await getAllEvents();
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
