import { readBuilderProgram } from "typescript";

// Deprecated
export function api_new_game_old(numPlayers: number) {
  const formData = new FormData();
  formData.append("numPlayers", numPlayers);

  fetch("http://localhost:3000/newgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ numPlayers: numPlayers }),
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementsByClassName(
          "home-container"
        )[0].style.pointerEvents = "none";
        document.getElementById("lobby-screen").style.zIndex = 1000;

        document.getElementById(
          "lobby-header"
        ).innerHTML = `<h2>Error creating new game :'(<h2>`;

        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      document.getElementsByClassName("home-container")[0].style.pointerEvents =
        "none";
      document.getElementById("lobby-screen").style.zIndex = 1000;

      document.getElementById(
        "room-code-lobby"
      ).innerText = `Room Code: ${data.roomId}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function api_new_game(numPlayers) {
  try {
    const result = await socket.emitWithAck("newGame", numPlayers);
    if (result.status) {
      console.log("Success:", result.roomId);
      await api_update_lobby(result.roomId, numPlayers);
    } else {
      document.getElementById(
        "lobby-header"
      ).innerHTML = `<h2>Error creating new game :'(<h2>`;
    }
  } catch (error) {
    console.error("Error creating new game:", error);
  }
}

export async function api_update_lobby(roomId, numPlayers) {
  try {
    const result = await socket.emitWithAck("getLobby", roomId);
    if (result.status && result.players) {
      const lobbyScreen = document.getElementById("lobby-screen");

      // Checks if lobby screen is not already visible
      if (lobbyScreen && !lobbyScreen.style.zIndex) {
        console.log("Updating Lobby");
        lobbyScreen.style.zIndex = 100;
        document.getElementsByClassName(
          "home-container"
        )[0].style.pointerEvents = "none";
        document.getElementById(
          "room-code-lobby"
        ).innerText = `Room Code: ${result.roomId}`;

        const playerList = document.getElementById("player-list");
        const readyList = document.getElementById("ready-list");
        for (let i = 1; i <= numPlayers; i++) {
          const playerListItem = document.createElement("li");
          const readyListItem = document.createElement("li");
          playerListItem.innerText = `Player ${i}`;
          readyListItem.innerText = `Not Ready`;
          playerListItem.id = `player-${i}`;
          readyListItem.id = `ready-${i}`;
          playerList.appendChild(playerListItem);
          readyList.appendChild(readyListItem);
        }
      }

      // Update Ready Statuses for each player that has joined
      for (let i = 0; i < result.players.length; i++) {
        const readyListItem = document.getElementById(`ready-${i + 1}`);
        if (readyListItem) {
          readyListItem.innerText = "Ready";
        }
      }
    } else {
      console.error(result.message);
      document.getElementById(
        "lobby-header"
      ).innerHTML = `<h2>Error updating Lobby :'(<h2>`;
    }
  } catch (error) {
    console.error("Error updating Lobby: ", error);
    throw new Error("Error updating Lobby: " + error.message);
  }
}
