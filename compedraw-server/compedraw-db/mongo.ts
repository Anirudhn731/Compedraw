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
    console.error("Error connecting to MongoDB: ", error);
    return null;
  }
}

export async function db_createNewGame(roomId, numPlayers, socket_id) {
    let games = await getgamesCollection();

    if(games) {
      try {
      const result = await games.insertOne({ createdAt: new Date(), roomId: roomId, numPlayers: numPlayers, playerIds: [socket_id] });
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
    else {
      console.error("Error connecting to MongoDB: games collection not found");
      return false;
    }
}

export async function db_getLobbyPlayers(roomId) {
  let games = await getgamesCollection();
  if(games) {
    try {
      const result = await games.findOne({roomId: roomId}, { projection: {playerIds: 1, _id: 0}});
      if (result) {
        console.log("Lobby players retrieved successfully:", result);
        return result.playerIds;
      }

    }
    catch (error) {
      console.error("Error retrieving lobby players for room: ", roomId, " Error Log: ", error);
      return null;
    }
  }
  else {
    console.error("Error connecting to MongoDB: games collection not found");
    return null;
  }
}

export async function db_addPlayertoRoom(games, roomID, socket_id) {
  try {
    const result = await games.updateOne(
      { roomId: roomID },
      { $addToSet: { playerIds: socket_id } }
    );
    if (result.modifiedCount > 0) {
      console.log("Player added to room successfully");
      return true;
    } else {
      console.error("Error adding player to room:", result);
      return false;
    }
  } catch (error) {
    console.error("Error adding player to room:", error);
    return false;
  }
}
