import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import DrawBoard from "./pages/Game/DrawBoard";
import "./pages/Game/DrawBoard.css";
import Home from "./pages/Home/Home";
import "./pages/Home/Home.css";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h1>CompeDraw!</h1>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:roomId" element={<DrawBoard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
