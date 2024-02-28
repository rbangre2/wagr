import { FriendRequest } from "@/models/FriendRequest";
import { Friend } from "@/models/User";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
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

export async function acceptFriendRequest(
  requestId: string,
  senderId: string,
  receiverId: string
): Promise<void> {
  const requestRef = doc(db, "FriendRequests", requestId);
  await updateDoc(requestRef, { status: "accepted" });

  const senderFriendRef = doc(db, "users", senderId, "friends", receiverId);
  const receiverFriendRef = doc(db, "users", receiverId, "friends", senderId);

  const friendData: Friend = { friendId: "", netResult: 0 };

  await setDoc(senderFriendRef, { ...friendData, friendId: receiverId });

  await setDoc(receiverFriendRef, { ...friendData, friendId: senderId });

  console.log(`Friend request ${requestId} accepted and friends added.`);
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

export async function addFriend(userId: string, friendId: string) {
  const userFriendsRef = collection(db, "users", "friends");

  await setDoc(doc(userFriendsRef, friendId), {
    friendId: friendId,
    netResult: 0,
  });

  const friendFriendsRef = collection(db, "users", friendId, "friends");
  await setDoc(doc(friendFriendsRef, userId), {
    friendId: userId,
    netResult: 0,
  });
}

export async function getFriends(userId: string) {
  const userFriendsRef = collection(db, "users", userId, "friends");

  // Get all friends from the subcollection
  const snapshot = await getDocs(userFriendsRef);
  const friends = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return friends;
}

export async function updateFriendData(
  userId: string,
  friendId: string,
  newNetResult: number
) {
  const friendDocRef = doc(db, "users", userId, "friends", friendId);

  await updateDoc(friendDocRef, {
    netResult: newNetResult,
  });
}

export async function removeFriend(userId: string, friendId: string) {
  await deleteDoc(doc(db, "users", userId, "friends", friendId));
  await deleteDoc(doc(db, "users", friendId, "friends", userId));
}
