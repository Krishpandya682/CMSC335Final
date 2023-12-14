import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

let client;
let db;
let users;
let comments;
let posts;
let replies;

async function connectToDatabase() {
  console.log("Connecting to database!");
  const mongoURI = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.fdxtfzw.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

  client = new MongoClient(mongoURI, {
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    console.log("Connected to mongoDB");
    db = client.db(process.env.MONGO_DB_NAME);

    users = db.collection(process.env.MONGO_USERS_COLLECTION);
    comments = db.collection(process.env.MONGO_COMMENTS_COLLECTION);
    posts = db.collection(process.env.MONGO_POSTS_COLLECTION);
    replies = db.collection(process.env.MONGO_REPLIES_COLLECTION);

    // You can perform other setup or initialization here if needed
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Call the function to connect to the database
// Use a promise to ensure the connection is established before using the exported variables
const databaseConnection = connectToDatabase();

// Export the collections and db
export { users, comments, posts, replies, db, databaseConnection };
