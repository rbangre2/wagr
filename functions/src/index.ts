import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {parse} from "date-fns";
import {FieldValue, Timestamp} from "firebase-admin/firestore";


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
  date: Timestamp;
  time: string;
  status: "upcoming" | "live" | "finished";
  competitionId: number;
  score?: string;
  result?: string;
}

export interface Bet {
  id: string;
  eventId: string;
  status: "Pending" | "Accepted" | "Declined" | "Resolved";
  createdAt: Date;
  acceptedAt?: Date;
  resolvedAt?: Date;

  // Sender details
  senderId: string;
  senderName: string;
  senderSelection: string;
  senderOdds: number;
  senderStake: number;
  senderPotentialWin: number;

  // Receiver details before acceptance (calculated based on the bet terms)
  receiverId: string;
  receiverName: string;
  receiverStake: number;
  receiverOdds: number;
  receiverSelection: string;
  receiverPotentialWin: number;

  result?: string; // winner of the bet
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
  events = events.concat(await fetchEventsFromAPI(244)); // champions league
  // do more later
  return events;
};

exports.updateEvents = functions.pubsub
  .schedule("every 48 hours")
  .onRun(async (context) => {
    await storeEventsInFirestore();
  });

export const getResultForEvent = async (
  event: Event
): Promise<string | null> => {
  const url = `https://livescore-api.com/api-client/teams/matches.json?key=${apiKey}&secret=${apiSecret}&number=1&team_id=${event.homeId}`;

  try {
    const response = await axios.get(url);
    const matches = response.data.data;

    const match = matches.length > 0 ? matches[0] : null;
    console.log(match);

    if (match && match.away_id == event.awayId) {
      return match.ft_score;
    }
    console.warn(`no matching match found for event: ${event.id}`);
    return null;
  } catch (error) {
    console.error(
      `error fetching historical data for event: ${event.id}`,
      error
    );
    throw error;
  }
};

const determineMatchResult = (ftScore: string): string => {
  const [homeScore, awayScore] = ftScore.split(" - ").map(Number);

  if (homeScore > awayScore) {
    return "Win";
  } else if (homeScore < awayScore) {
    return "Lose";
  } else {
    return "Draw";
  }
};

const updateEventResult = async (
  eventId: string,
  score: string,
  result: string
): Promise<void> => {
  const eventRef = db.doc(`events/${eventId}`);
  try {
    await eventRef.update({
      score,
      result,
      status: "finished",
    });
  } catch (error) {
    console.error(`error updating event ${eventId}:`, error);
    throw error;
  }
};

const resolveEventResults = async (fetchedEvents: Event[]) => {
  const now = new Date();
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

  const pastEvents = fetchedEvents.filter((fetchedEvent) => {
    const eventDate = new Date(
      (fetchedEvent.date as Timestamp).toDate()
    );
    return eventDate < fiveHoursAgo && fetchedEvent.status === "upcoming";
  });

  for (const event of pastEvents) {
    const ftScore = await getResultForEvent(event);
    if (ftScore) {
      const result = determineMatchResult(ftScore);
      await updateEventResult(event.id, ftScore, result);
    }
  }
};

const getDBEvents = async (): Promise<Event[]> => {
  try {
    const snapshot = await admin.firestore().collection("events").get();
    const events: Event[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
    return events;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

exports.resolveEvents = functions.pubsub
  .schedule("every 8 hours")
  .onRun(async (context) => {
    const events = await getDBEvents();
    await resolveEventResults(events);
  });

exports.scheduledBetResolution = functions.pubsub
  .schedule("every 8 hours")
  .onRun(async (context) => {
    const finishedEventsQuery = admin
      .firestore()
      .collection("events")
      .where("status", "==", "finished");
    const finishedEventsSnapshot = await finishedEventsQuery.get();

    if (finishedEventsSnapshot.empty) {
      console.log("No finished events found.");
      return null;
    }
    const finishedEvents: Event[] = finishedEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Event, "id">),
    }));
    console.log(`${finishedEvents.length} finished events found`);


    const batch = admin.firestore().batch();

    for (const event of finishedEvents) {
      const eventId = event.id.toString();
      const eventResult = event.result;
      console.log(`resolving ${event.homeTeam} vs. 
        
      ''${event.awayTeam}: ${event.id} `);

      if (eventResult) {
        const betsQuery = admin
          .firestore()
          .collection("bets")
          .where("eventId", "==", Number(eventId))
          .where("status", "==", "Accepted");
        const betsSnapshot = await betsQuery.get();

        console.log(`found ${betsSnapshot.size} related bets to event`);

        for (const betDoc of betsSnapshot.docs) {
          const bet = betDoc.data() as Bet;
          const outcome = determineBetOutcome(bet, event);
          const betRef = betDoc.ref;

          console.log(`resolving bet ${bet.id}`);

          batch.update(betRef, {
            status: "Resolved",
            result: outcome,
            resolvedAt: FieldValue.serverTimestamp(),
          });

          // Determine the winning and losing amounts and users
          const winnerId = outcome === "Won" ? bet.senderId : bet.receiverId;
          const loserId = outcome === "Won" ? bet.receiverId : bet.senderId;
          const winnerProfit =
            outcome === "Won" ?
              bet.senderPotentialWin - bet.senderStake :
              bet.receiverPotentialWin - bet.receiverStake;

          // For the loser, the net result is simply the negative of their stake
          const loserLoss =
            outcome === "Won" ? -bet.receiverStake : -bet.senderStake;

          // Fetch both user documents and update balances
          const winnerRef = admin.firestore().doc(`users/${winnerId}`);
          const loserRef = admin.firestore().doc(`users/${loserId}`);

          // Update the winner's balance by their profit
          batch.update(winnerRef, {
            balance: admin.firestore.FieldValue.increment(winnerProfit),
          });

          // Update the loser's balance by their loss (subtract the stake)
          batch.update(loserRef, {
            balance: admin.firestore.FieldValue.increment(loserLoss),
          });

          // Update net result in the friends subcollection for the winner
          console.log("updating friends subcollection net results for winner");
          const friendRefWinner = winnerRef.collection("friends").doc(loserId);
          batch.set(
            friendRefWinner,
            {netResult: admin.firestore.FieldValue.increment(winnerProfit)},
            {merge: true}
          );

          // Update net result in the friends subcollection for the loser
          console.log("updating friends subcollection net results for loser");
          const friendRefLoser = loserRef.collection("friends").doc(winnerId);
          batch.set(
            friendRefLoser,
            {netResult: admin.firestore.FieldValue.increment(loserLoss)},
            {merge: true}
          );
        }
      }
    }

    // Commit the batch
    await batch.commit();
    console.log("Resolved bets for finished events.");
    return null;
  });

const determineBetOutcome = (bet: Bet, event: Event): "Won" | "Lost" => {
  if (
    (event.result === "Win" && bet.senderSelection === event.homeTeam) ||
    (event.result === "Lose" && bet.senderSelection === event.awayTeam) ||
    (event.result === "Draw" && bet.senderSelection === "Draw")
  ) {
    return "Won";
  } else {
    return "Lost";
  }
};
