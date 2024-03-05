import { FriendRequest } from "@/models/FriendRequest";
import { UserFriend } from "@/models/User";
import { db } from "@/utils/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  writeBatch,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Friend } from "@/models/User";


export async function sendFriendRequest(sender: string, receiver: string) {
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

// function to accept friend request
export async function acceptFriendRequest(
  requestId: string,
  senderId: string,
  receiverId: string
): Promise<void> {
  const requestRef = doc(db, "FriendRequests", requestId);
  await updateDoc(requestRef, { status: "accepted" });

  const senderFriendRef = doc(db, "users", senderId, "friends", receiverId);
  const receiverFriendRef = doc(db, "users", receiverId, "friends", senderId);

  const friendData: UserFriend = { friendId: "", netResult: 0 };

  await setDoc(senderFriendRef, { ...friendData, friendId: receiverId });

  await setDoc(receiverFriendRef, { ...friendData, friendId: senderId });

  console.log(`Friend request ${requestId} accepted and friends added.`);
}

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

export async function getFriends(userId: string) {
  const userFriendsRef = collection(db, "users", userId, "friends");
  const snapshot = await getDocs(userFriendsRef);

  const friendPromises = snapshot.docs.map(async (docSnapshot) => {
    const friendId = docSnapshot.id; // Assuming the friend's user ID is stored as the document ID
    const friendRef = doc(db, "users", friendId);
    const friendSnap = await getDoc(friendRef);

    if (friendSnap.exists()) {
      const friendData = friendSnap.data();
      const name = `${friendData.firstName} ${friendData.lastName}`;

      return {
        id: friendId,
        name: name,
        profilePicture:
          friendData.profilePicture || "https://placeimg.com/67/10/any",
        status: "Online",
        lastActive: friendData.lastActive || new Date().toISOString(),
        netResult: docSnapshot.data().netResult || 0,
      };
    } else {
      return null;
    }
  });

  const friends = (await Promise.all(friendPromises)).filter(
    (friend): friend is Friend => friend !== null
  );

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
  const batch = writeBatch(db);

  batch.delete(doc(db, "users", userId, "friends", friendId));
  batch.delete(doc(db, "users", friendId, "friends", userId));

  const friendRequestQuery = query(
    collection(db, "FriendRequests"),
    where("sender", "in", [userId, friendId]),
    where("receiver", "in", [userId, friendId])
  );

  try {
    const querySnapshot = await getDocs(friendRequestQuery);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Friendship and any related friend requests successfully removed.');
  } catch (error) {
    console.error('Error removing friendship and related friend requests:', error);
    throw new Error('Failed to remove friendship.');
  }
}





export async function checkFriendRequestStatus( sender: string, receiver: string) {
  const q = query(
    collection(db, "FriendRequests"),
    where("sender", "==", sender),
    where("receiver", "==", receiver)
  );
  const querySnapshot = await getDocs(q);
  const friendRequests: FriendRequest[] = querySnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as FriendRequest)
  );
  return { exists: friendRequests.length > 0, id: friendRequests[0]?.id };
}