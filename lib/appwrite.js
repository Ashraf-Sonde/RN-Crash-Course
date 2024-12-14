import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
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
const bucket = new Storage(client);

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
    console.log("Error getting trending posts: ", e);
    throw new Error(e);
  }
};

// functionName: searchPosts
// Descriptiom: Get search posts (videos) from appwrite database
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query)],
    );

    return posts.documents;
  } catch (e) {
    console.log("Error searching posts: ", e);
    throw new Error(e);
  }
};

// functionName: getUserPosts
// Descriptiom: Get posts (videos) created by user from appwrite database
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("creator", userId)],
    );

    return posts.documents;
  } catch (e) {
    console.log("Error getting user posts: ", e);
    throw new Error(e);
  }
};

// functionName: signOut
// Descriptiom: sign-out the currently logged-in user
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (e) {
    throw new Error(`Error signing out: ${e}`);
  }
};

// functionName: getFilePreview
// Descriptiom: get uploaded file's preview
export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = bucket.getFileView(config.bucketId, fileId);
    } else if (type === "image") {
      fileUrl = bucket.getFilePreview(
        config.bucketId,
        fileId,
        2000,
        2000,
        "top",
        100,
      );
    } else {
      throw new Error(`Invalid file type`);
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (e) {
    throw new Error(`Error getting file preview: ${e}`);
  }
};

// functionName: uploadFile
// Descriptiom: upload file to appwrite
export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...fileParams } = file;
  const asset = { type: mimeType, ...fileParams };

  try {
    const uploadedFile = await bucket.createFile(
      config.bucketId,
      ID.unique(),
      asset,
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (e) {
    throw new Error(`Error uploading file: ${e}`);
  }
};

// functionName: uploadVideo
// Descriptiom: upload a new video
export const uploadVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newVideo = await databases.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    );

    return newVideo;
  } catch (e) {
    throw new Error(`Error uploading video: ${e}`);
  }
};
