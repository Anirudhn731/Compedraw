import { Link, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { api_new_game } from "../../api/api_calls";

function Home() {
  const navigate = useNavigate();

  const handleNewGameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numPlayers = event.currentTarget.numPlayers.value;
    if (!numPlayers || isNaN(Number(numPlayers)) || Number(numPlayers) < 1) {
      alert("Please enter a valid number of players");
      return;
    }

    api_new_game(Number(numPlayers));
  };

  const handleLinkGameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const roomId = event.currentTarget.roomcode.value;
    if (!roomId) {
      alert("Please enter a room code");
      return;
    }
    navigate("/game/" + roomId);
  };

  return (
    <>
      <div className="home-container">
        <div className="new-game-container">
          <label> Enter the number of players </label>
          <form onSubmit={handleNewGameSubmit}>
            <input type="text" placeholder="1" id="numPlayers" />
            <button type="submit">Start Game</button>
          </form>
        </div>
        <div className="link-game-container">
          <label> Enter Room Code </label>
          <form onSubmit={handleLinkGameSubmit}>
            <input type="text" id="roomcode" />
            <button type="submit">Join Game</button>
          </form>
        </div>
      </div>

      <div id="lobby-screen">
        <div id="lobby-header">
          <h2>Lobby</h2>
          <h2 id="room-code-lobby"></h2>
          <label>Waiting for other players!...</label>
        </div>
        <div id="lobby-body">
          <ul id="player-list"></ul>
        </div>
      </div>
    </>
  );
}

export default Home;
