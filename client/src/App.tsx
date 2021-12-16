import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomeScreen } from "./pages/HomeScreen";

function App() {
  return (
    <Router>
      <main className="py-3">
        <Container>
          {/* <Route path="/" element={<HomeScreen />} /> */}
          <Route path="/" component={HomeScreen} />
        </Container>
      </main>
    </Router>
  );
}

export default App;
