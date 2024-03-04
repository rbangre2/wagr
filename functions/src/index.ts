import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {parse} from "date-fns";

const apiKey = functions.config().livescore.apikey;
const apiSecret = functions.config().livescore.apisecret;

admin.initializeApp();
const db = admin.firestore();

export interface Event {
  id: string;
  homeTeam: string;
  homeId: number;
  awayTeam: string;
  awayId: number;
  league: string;
  location: string;
  date: Date;
  time: string;
  status: "upcoming" | "finished";
  competitionId: number;
  score?: string;
  result?: string;
}

const fetchFixturesPage = async (url: string): Promise<any[]> => {
  const response = await axios.get(url);
  return response.data.data.fixtures;
};

const fetchEventsFromAPI = async (competitionId: number): Promise<Event[]> => {
  const baseUrl = "https://livescore-api.com/api-client/fixtures/matches.json";
  const queryParams = `key=${apiKey}&secret=${apiSecret}&competition_id=
    ${competitionId}&lang=en`;
  let url = `${baseUrl}?${queryParams}`;
  let fixtures = [];

  try {
    fixtures = await fetchFixturesPage(url);
    for (let i = 0; i < 2; i++) {
      const response = await axios.get(url);
      if (response.data.data.next_page) {
        url = response.data.data.next_page;
        const nextPageFixtures = await fetchFixturesPage(url);
        fixtures = fixtures.concat(nextPageFixtures);
      } else {
        break;
      }
    }

    const upcoming = "upcoming";

    const events = fixtures.map((fixture) => ({
      id: fixture.id,
      homeTeam: fixture.home_name,
      homeId: fixture.home_id,
      awayTeam: fixture.away_name,
      awayId: fixture.away_id,
      league: fixture.competition.name,
      competitionId: fixture.competition_id,
      location: fixture.location,
      date: fixture.date,
      time: fixture.time,
      status: upcoming as "upcoming",
    }));

    return events;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    throw error;
  }
};

const storeEventsInFirestore = async () => {
  const events = await getAllEvents();
  const eventsCollection = db.collection("events");

  const existingEventsSnapshot = await eventsCollection.get();
  const existingEventIds = existingEventsSnapshot.docs.map((doc) => doc.id);

  const newEvents = events.filter(
    (event) => !existingEventIds.includes(String(event.id))
  );

  // Batch write new events to Firestore
  const batch = db.batch();
  newEvents.forEach((event) => {
    const dateTimeUTCString = `${event.date}T${event.time}Z`;
    const eventDate = parse(
      dateTimeUTCString,
      "yyyy-MM-dd'T'HH:mm:ss'Z'",
      new Date()
    );
    const eventRef = eventsCollection.doc(String(event.id));
    batch.set(eventRef, {
      ...event,
      date: eventDate,
    });
  });

  await batch.commit();
  console.log(`${newEvents.length} new events added.`);
};

const getAllEvents = async () => {
  let events: Event[] = [];
  events = events.concat(await fetchEventsFromAPI(1)); // bundesliga
  events = events.concat(await fetchEventsFromAPI(2)); // epl
  events = events.concat(await fetchEventsFromAPI(3)); // la liga
  events = events.concat(await fetchEventsFromAPI(4)); // serie a
  events = events.concat(await fetchEventsFromAPI(5)); // ligue 1
  // do more later
  return events;
};

exports.updateEvents = functions.pubsub
  .schedule("every 48 hours")
  .onRun(async (context) => {
    await storeEventsInFirestore();
  });
