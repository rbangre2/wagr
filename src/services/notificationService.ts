import {
  doc,
  collection,
  query,
  updateDoc,
  getDocs,
  addDoc,
  Timestamp,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase/firebaseConfig";
import { Notification, ActivityType } from "@/models/Notification";

export const createNotification = async (
  userId: string,
  type: ActivityType,
  message: string
): Promise<void> => {
  const userNotificationsRef = collection(db, "users", userId, "notifications");
  try {
    await addDoc(userNotificationsRef, {
      type: type,
      message: message,
      read: false,
      date: Timestamp.fromDate(new Date()),
    });
    console.log("notification created for user:", userId);
  } catch (error) {
    console.error("failed to create notification ", error);
  }
};

export const getUserNotifications = async (
  userId: string | undefined,
  numNotifs: number
): Promise<Notification[]> => {
  if (!userId) {
    return [];
  }
  const userNotificationsRef = collection(db, "users", userId, "notifications");
  const notificationsQuery = query(
    userNotificationsRef,
    orderBy("date", "desc"),
    limit(numNotifs)
  );

  try {
    const querySnapshot = await getDocs(notificationsQuery);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate(),
    })) as Notification[];
  } catch (error) {
    console.error("get user notifications error:", error);
    throw new Error("Failed to get user notifications");
  }
};

export const readNotification = async ({
  userId,
  notificationId,
}: {
  userId: string;
  notificationId: string;
}) => {
  const notificationRef = doc(
    db,
    "users",
    userId,
    "notifications",
    notificationId
  );
  await updateDoc(notificationRef, { read: true });
};

