import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { GameInfoScreen } from "./pages/GameInfoScreen";
import { HomeScreen } from "./pages/HomeScreen";

function App() {
  return (
    <Router>
      <main className="py-3">
        <Container>
          {/* <Route path="/" element={<HomeScreen />} /> */}
          <Route path="/" component={HomeScreen} exact />
          <Route path="/game/:roomId" component={GameInfoScreen} exact />
        </Container>
      </main>
    </Router>
  );
}

export default App;
