import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../utils/firebase/firebaseConfig";
import { User } from "@/models/User";

export const signup = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstname,
        lastName: lastname,
        email: email,
        balance: 0,
        createdAt: new Date(),
      });
      console.log("User created and added to Firestore:", user.uid);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An error occurred during signup.");
    }
  }
};

// signIn function
export const signIn = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(
      "User signed in successfully with email:",
      userCredential.user.email
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Sign-in error:", error.message);
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign-out error:", error);
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const getUserByEmail = async (
  email: string | null
): Promise<User | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;
      return { ...userData, id: userDoc.id };
    } else {
      console.log("No user found with the given email");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user");
  }
};

export const deposit = async (
  userId: string | undefined,
  amount: number
): Promise<User> => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    balance: increment(amount),
  });

  const updatedUserSnap = await getDoc(userRef);
  if (!updatedUserSnap.exists()) {
    throw new Error("User not found");
  }

  const updatedUserData = updatedUserSnap.data() as User;
  const updatedUser: User = {
    ...updatedUserData,
    id: updatedUserSnap.id,
  };

  return updatedUser;
};

export const updateUserBalance = async (
  userId: string,
  newBalance: number
): Promise<void> => {
  if (!userId) {
    throw new Error("user id is required");
  }

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    balance: newBalance,
  });
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      return { ...userData, id: userSnap.id };
    } else {
      console.log("no user found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};
