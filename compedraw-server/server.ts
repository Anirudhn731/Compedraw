const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const { db_createNewGame, db_getLobbyPlayers, db_addPlayertoRoom } = require("./compedraw-db/mongo.ts");
const { generateRoomId } = require("./utils.tsx");

app.get("/", (req, res) => {
  console.log("Root endpoint hit");
  res.send("Welcome to the CompeDraw server!");
});

// Deprecated
app.post("/newgame", async (req, res) => {
  const roomId = 1234;

  const dbResult = await db_createNewGame(roomId, req.body.numPlayers);

  if (dbResult == true) {
    console.log("api db_createNewGame returned true");
    res.status(200).send({ roomId: roomId });
  } else {
    res.status(500).send({
      message: "Error creating new game",
    });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Retrieve Lobby Players Event
  socket.on("getLobby", async (roomId, callback) => {
    try {
      const dbResult = await db_getLobbyPlayers(roomId);
      if (dbResult) {
        callback({status: true, players: dbResult.playerIds, numPlayers: dbResult.numPlayers});
      }
      else {
        console.error("Error retrieving Lobby Players for room: ", roomId);
        callback({status: false});
      }
    }
    catch (error) {
      console.error("getLobby call failed - Error Log: ", error);
      callback({status: false});
    }
  });
  
  // New Game Event 
  socket.on("newGame", async (numPlayers, callback) => {
    const roomId = generateRoomId();
    
    try {
      const dbResult = await db_createNewGame(roomId, numPlayers, socket.id);
      await socket.join(roomId);
      console.log("Before emitting updateLobby for room: ", roomId);
      await io.to(roomId).emit("updateLobby", roomId);
      console.log("After emitting updateLobby");
      callback({status: true, roomId: roomId });       
    }
    catch (error) {
      console.error("Error creating new game - Error Log: ", error);
      callback({status: false});
    }
  });

  // Join Game Event
  socket.on("joinGame", async (roomId, callback) => {
    try {
      await db_addPlayertoRoom(roomId, socket.id);
      socket.join(roomId);
      await io.to(roomId).emit("updateLobby", roomId);
      callback({status: true, roomId: roomId });
    }
    catch (error) {
      console.error("Error joining game - Error Log: ", error);
      callback({status: false});
    }
  })

});

server.listen(3000, () => console.log("Server running on port 3000"));
