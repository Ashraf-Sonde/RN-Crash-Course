import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
import { envConstants } from "@/constants";

export const config = {
  endpoint: envConstants.appwriteEndpoint,
  platform: envConstants.appwritePlatform,
  projectId: envConstants.appwriteProjectId,
  databaseId: envConstants.appwriteDatabaseId,
  usersCollectionId: envConstants.appwriteUsersCollectionId,
  videosCollectionId: envConstants.appwriteVideosCollectionId,
  bucketId: envConstants.appwriteBucketId,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);

// functionName: createUser
// Description: Create a user in appwrite and database
export const createUser = async (email, password, username) => {
  try {
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newUserAccount) {
      console.error("Error creating new user account");
      throw Error;
    }

    // Create an initials avatar for new user account
    const avatarUrl = avatars.getInitials(username);

    // Sign in the new user
    await signIn(email, password);

    // Create user in the database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      { accountId: newUserAccount.$id, username, email, avatar: avatarUrl },
    );

    return newUser;
  } catch (e) {
    console.log("Error while creating user", e);
    throw new Error(e);
  }
};

// functionName: signIn
// Description: Sign-in the user
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (e) {
    console.error("Error signing in the user:", e);
    throw new Error(e);
  }
};

// functionName: getCurrentUser
// Description: Get currently logged-in user details
export const getCurrentUser = async () => {
  try {
    const currentUserAccount = await account.get();

    if (!currentUserAccount) {
      console.error("No current user account found");
      throw Error;
    }

    const currentUserDetails = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentUserAccount.$id)],
    );

    if (!currentUserDetails) {
      console.error("No current user details found");
      throw Error;
    }

    return currentUserDetails.documents[0];
  } catch (e) {
    console.error("Error getting current user", e);
    throw new Error(e);
  }
};

// functionName: getAllPosts
// Descriptiom: Get all posts (videos) from appwrite database
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
    );

    return posts.documents;
  } catch (e) {
    console.log("Error getting all posts: ", e);
    throw new Error(e);
  }
};

// functionName: getTrendingPosts
// Descriptiom: Get trending posts (videos) from appwrite database
export const getTrendingPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    );

    return posts.documents;
  } catch (e) {
    console.log("Error getting all posts: ", e);
    throw new Error(e);
  }
};
