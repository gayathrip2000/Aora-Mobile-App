import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Storage,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "667aef76002de3e21204",
  databaseId: "667af172000833fb850e",
  userCollectionId: "667af1bf0020492c30ac",
  videoCollectionId: "667af211002c5e610b51",
  storageId: "667af555000331946463",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Sign In
export async function signIn(email, password) {
  try {
    // Check for existing session
    const session = await account.get();
    if (session) {
      // Use existing session
      return session;
    } else {
      // Create a new session
      const newSession = await account.createEmailPasswordSession(email, password);
      return newSession;
    }
  } catch (error) {
    if (error.message === "No session") {
      // Create a new session if no existing session is found
      const newSession = await account.createEmailPasswordSession(email, password);
      return newSession;
    } else {
      throw new Error(error);
    }
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

