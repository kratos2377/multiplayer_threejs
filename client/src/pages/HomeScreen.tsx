import React from "react";
import { Button, Col } from "react-bootstrap";
import Header from "../components/Header";

export const HomeScreen = () => {
  return (
    <>
      <Header />
      <h1 className="d-flex justify-content-center">Welcome to the game</h1>
      <div>
        <Col className="d-flex justify-content-center my-2">
          <Button>Create Room</Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <Button>Join Room</Button>
        </Col>
      </div>
    </>
  );
};
