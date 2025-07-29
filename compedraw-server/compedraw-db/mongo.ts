import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/compedraw")

export async function db_createNewGame(roomId, numPlayers) {
  try {
    let games;
    await client.connect();
    games = client.db("compedrawDB").collection("games");
 
    const result = await games.insertOne({ roomId: roomId, numPlayers: numPlayers });
    if (result.acknowledged && result.insertedId) {
      console.log("New game created successfully:", result);
      return true;
    } else {
      console.error("Error creating new game 1:", result);
      return false;
    }
  } catch (error) {
    console.error("Error creating new game 2:", error);
    return false;
  }
}
