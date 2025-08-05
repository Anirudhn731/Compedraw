import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/compedraw")

async function getgamesCollection() {
  try {
    let games;
    await client.connect();
    games = client.db("compedrawDB").collection("games");

    return games;
  }
  catch (error) {
    throw new Error("Error connecting to MongoDB: " + error);
  }
}

export async function db_createNewGame(roomId, numPlayers, socket_id) {
  try {
    let games = await getgamesCollection();
    const result = await games.insertOne({ createdAt: new Date(), roomId: roomId, numPlayers: numPlayers, playerIds: [socket_id] });
    if (result.acknowledged && result.insertedId) {
      console.log("New game created successfully:", result);
    } else {
      throw new Error("Error inserting new information in database - returned: " + result);
    }
  } catch (error) {
    throw error;
  }
}

export async function db_getLobbyPlayers(roomId) {
  try {
    let games = await getgamesCollection();
    const result = await games.findOne({roomId: roomId}, { projection: {numPlayers: 1, playerIds: 1, _id: 0}});
    if (result) {
      console.log("Lobby players retrieved successfully:", result);
      return result;
    }
    else {
      throw new Error("Error retrieving Lobby Players from database");
    }
  }
  catch (error) {
    throw error;
  }
}

export async function db_addPlayertoRoom(roomId, socket_id) {
  try {
    let games = await getgamesCollection();
    const result = await games.updateOne(
      { roomId: roomId },
      { $addToSet: { playerIds: socket_id } }
    );
    if (result.modifiedCount > 0) {
      console.log("Player added to room successfully");
    } else {
      throw new Error("Error adding player to room in database - returned: " + result);
    }
  } catch (error) {
    throw error;
  }
}
