import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

const apiKey = functions.config().livescore.apikey;
const apiSecret = functions.config().livescore.apisecret;

admin.initializeApp();
const db = admin.firestore();

const fetchFixturesPage = async (url: string): Promise<any[]> => {
  const response = await axios.get(url);
  return response.data.data.fixtures;
};

const fetchEventsFromAPI = async (competitionId: number): Promise<any[]> => {
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
    const events = fixtures.map((fixture) => ({
      id: fixture.id,
      homeTeam: fixture.home_name,
      homeId: fixture.home_id,
      awayTeam: fixture.away_name,
      awayId: fixture.away_id,
      league: fixture.competition.name,
      competitionId: fixture.competition_id,
      location: fixture.location,
      date: new Date(fixture.date),
      time: fixture.time,
      status: "upcoming",
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
    const eventRef = eventsCollection.doc(String(event.id));
    batch.set(eventRef, event);
  });

  await batch.commit();
  console.log(`${newEvents.length} new events added.`);
};

/**
 * Fetches and returns all events from multiple competitions.
 * Currently fetches events from La Liga (ID 3) and Serie A (ID 4).
 *
 * @return {Promise<any[]>} A promise that resolves to
 * an array of event objects.
 */
async function getAllEvents() {
  let events: any[] = [];
  events = events.concat(await fetchEventsFromAPI(1)); // bundesliga
  events = events.concat(await fetchEventsFromAPI(2)); // epl
  events = events.concat(await fetchEventsFromAPI(3)); // la liga
  events = events.concat(await fetchEventsFromAPI(4)); // serie a
  events = events.concat(await fetchEventsFromAPI(5)); // ligue 1
  // do more later
  return events;
}

exports.updateEvents = functions.pubsub
  .schedule("every 48 hours")
  .onRun(async (context) => {
    await storeEventsInFirestore();
  });

const fetchUpcomingPastEvents = async () => {
  const now = admin.firestore.Timestamp.now();
  const eventsRef = db.collection("events");
  const snapshot = await eventsRef
    .where("date", "<", now)
    .where("status", "==", "Upcoming")
    .get();

  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
};

const fetchHistoricalDataForEvent = async (event: any) => {
  // Format the date to YYYY-MM-DD
  const eventDate = event.date.toDate().toISOString().split("T")[0];
  const url = `http://livescore-api.com/api-client/scores/history.json?key=${apiKey}
    &secret=${apiSecret}&from=${eventDate}&to=${eventDate}`;

  try {
    const response = await axios.get(url);
    // Filter the response to find the match related to the event
    // should be a singular event;
    const match = response.data.data.match[0];

    return match || null;
  } catch (error) {
    console.error(
      `Error fetching historical data for event: ${event.id}`,
      error
    );
    throw error;
  }
};

const updateEventWithResult = async (event: any, match: any) => {
  if (match) {
    // Parse the 'ft_score' to get home and away scores
    const scores = match.ft_score.split(" - ").map(Number);
    const homeScore = scores[0];
    const awayScore = scores[1];

    // Determine the result based on home and away scores
    let result;
    if (homeScore > awayScore) {
      result = event.homeTeam;
    } else if (homeScore < awayScore) {
      result = event.awayTeam;
    } else {
      result = "Tie";
    }

    const eventRef = db.collection("events").doc(event.id);
    await eventRef.update({
      status: "Finished",
      score: match.ft_score,
      result: result,
    });
    console.log(
      `Event ${event.id} updated with result: 
        ${match.score} and outcome: ${result}`
    );
  } else {
    console.log(
      `No match found for event ${event.id} on date ${event.date
        .toDate()
        .toISOString()}`
    );
  }
};

exports.resolveEvents = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const eventsToResolve = await fetchUpcomingPastEvents();

    for (const event of eventsToResolve) {
      const match = await fetchHistoricalDataForEvent(event);
      await updateEventWithResult(event, match);
    }

    console.log(`Resolved ${eventsToResolve.length} events.`);
  });
