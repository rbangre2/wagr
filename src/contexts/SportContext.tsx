import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getEvents } from "@/services/sportsService";
import { Event } from "@/models/Event";

type SportsContextType = {
  data: Event[];
  setData: React.Dispatch<React.SetStateAction<Event[]>>;
};

const SportsContext = createContext<SportsContextType | null>(null);

type SportsProviderProps = {
  children: ReactNode;
};

export const SportsProvider = ({ children }: SportsProviderProps) => {
  const [data, setData] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        setData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <SportsContext.Provider value={{ data, setData }}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSportsContext = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error("useSportsContext must be used within a SportsProvider");
  }
  return context;
};
