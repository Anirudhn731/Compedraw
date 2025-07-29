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
      document.getElementsByClassName("home-container")[0].style.pointerEvents =
        "none";
      document.getElementById("lobby-screen").style.zIndex = 1000;

      document.getElementById(
        "room-code-lobby"
      ).innerText = `Room Code: ${result.roomId}`;
    } else {
      document.getElementsByClassName("home-container")[0].style.pointerEvents =
        "none";
      document.getElementById("lobby-screen").style.zIndex = 1000;

      document.getElementById(
        "lobby-header"
      ).innerHTML = `<h2>Error creating new game :'(<h2>`;

      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error creating new game:", error);
  }
}
