import { FriendRequest } from "@/models/FriendRequest";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function sendFriendReqeust(sender: string, receiver: string) {
  const friendRequest: Omit<FriendRequest, "id"> = {
    sender,
    receiver,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  try {
    const docRef = await addDoc(
      collection(db, "FriendRequests"),
      friendRequest
    );
    console.log(`friend request send with id: ${docRef.id}`);
  } catch (error) {
    console.error(`error sending friend request: ${error}`);
  }
}

export async function acceptFriendRequest(requestId: string) {
  try {
    const requestRef = doc(db, "FriendRequests", requestId);
    await updateDoc(requestRef, {
      status: "accepted",
    });
    console.log(`Friend request ${requestId} accepted`);
  } catch (error) {
    console.error(`Error accepting friend request: ${error}`);
  }
}

// funcion to reject a friend request
export async function rejectFriendRequest(requestId: string) {
  try {
    const requestRef = doc(db, "FriendRequests", requestId);
    await updateDoc(requestRef, {
      status: "rejected",
    });
    console.log(`Friend request ${requestId} rejected`);
  } catch (error) {
    console.error(`Error rejecting friend request: ${error}`);
  }
}

export async function getIncomingFriendRequestsForUser(
  userId: string
): Promise<FriendRequest[]> {
  try {
    const q = query(
      collection(db, "FriendRequests"),
      where("receiver", "==", userId),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    const friendRequests: FriendRequest[] = querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as FriendRequest)
    );
    return friendRequests;
  } catch (error) {
    console.error(`Error getting friend requests: ${error}`);
    return [];
  }
}

// Function to get pending outgoing friend requests for a user
export async function getOutgoingFriendRequests(
  userId: string
): Promise<FriendRequest[]> {
  try {
    const friendRequestsRef = collection(db, "FriendRequests");
    const q = query(
      friendRequestsRef,
      where("sender", "==", userId),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    const friendRequests: FriendRequest[] = querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as FriendRequest)
    );
    return friendRequests;
  } catch (error) {
    console.error(`Error getting outgoing friend requests: ${error}`);
    return [];
  }
}
