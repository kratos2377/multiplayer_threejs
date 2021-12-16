import React, { useState } from "react";
import { Button, Col, Modal, Form, Container, Row } from "react-bootstrap";
import Header from "../components/Header";

export const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

  const [openCreateRoomModal, setOpenCreateRoom] = useState(false);
  const [openJoinRoomModal, setOpenJoinRoom] = useState(false);

  const changeCreateRoomStatus = () => setOpenCreateRoom(true);
  const changeJoinRoomStatus = () => setOpenJoinRoom(true);
  const handleClose = () => {
    setOpenCreateRoom(false);
    setOpenJoinRoom(false);
  };

  const createRoom = () => {};

  const joinRoom = () => {};

  return (
    <>
      <Header />
      <h1 className="d-flex justify-content-center">Welcome to the game</h1>
      <div>
        <Col className="d-flex justify-content-center my-2">
          <Button onClick={changeCreateRoomStatus}>Create Room</Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <Button onClick={changeJoinRoomStatus}>Join Room</Button>
        </Col>
      </div>

      <Modal show={openCreateRoomModal}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Create Room</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Enter your username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Necromorph23"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary">Create</Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>

      <Modal show={openJoinRoomModal}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Join Room</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Enter your username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Necromorph23"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Enter Room Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="qwerty123"
                  onChange={(e) => setCode(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary">Join Room</Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    </>
  );
};
