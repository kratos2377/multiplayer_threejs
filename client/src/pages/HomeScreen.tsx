import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Form, Alert } from "react-bootstrap";
import Header from "../components/Header";
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
} from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { socket } from "../services/socket.js";
import {
  GAME_IN_PROGRESS,
  ROOM_DOES_NOT_EXIST,
  ROOM_IS_FULL,
  USERNAME_EXIST_IN_ROOM,
} from "../constants";

interface HomeScreenProps extends RouteComponentProps {}

export const HomeScreen: React.FC<HomeScreenProps> = ({ history }) => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [socketId, setSocketId] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openCreateRoomModal, setOpenCreateRoom] = useState(false);
  const [openJoinRoomModal, setOpenJoinRoom] = useState(false);
  const [createRoomMutation] = useCreateRoomMutation();
  const [joinRoomMutation] = useJoinRoomMutation();
  socket.on("setId", function (data) {
    setSocketId(data.id);
    console.log(socket);
  });

  const changeCreateRoomStatus = () => setOpenCreateRoom(true);
  const changeJoinRoomStatus = () => setOpenJoinRoom(true);
  const handleClose = () => {
    setOpenCreateRoom(false);
    setOpenJoinRoom(false);
  };

  const createRoom = async () => {
    setOpenCreateRoom(false);
    setOpenJoinRoom(false);

    if (username.trim() === "" || username.length <= 4) {
      setErrorMessage("Username Length must be greater than 4");
      setError(true);
      return;
    }

    const values = {
      adminId: socketId,
      username: username,
    };
    const response = await createRoomMutation({
      variables: values,
    });

    var code1 = response?.data?.createRoom?.response?.code?.toString();

    history.push("/game/" + code1, { username });
  };

  const joinRoom = async () => {
    setOpenCreateRoom(false);
    setOpenJoinRoom(false);
    setError(false);

    if (username.trim() === "" || username.length <= 4) {
      setErrorMessage("Username Length must be greater than 4");
      setError(true);
      return;
    }

    const values = {
      userId: socketId,
      username: username,
      roomCode: code,
    };
    const response = await joinRoomMutation({
      variables: values,
    });

    if (!response?.data?.joinRoom?.response?.values) {
      var errorDetected = response?.data?.joinRoom?.response?.error?.toString();

      if (errorDetected === ROOM_DOES_NOT_EXIST) {
        setErrorMessage("Room Doesn't Exist. Check it Again");
        setError(true);
        return;
      }

      if (errorDetected === ROOM_IS_FULL) {
        setErrorMessage("Room is Full. Can't Enter");
        setError(true);
        return;
      }

      if (errorDetected === GAME_IN_PROGRESS) {
        setErrorMessage("Game in Progress. Can't Enter now");
        setError(true);
        return;
      }

      if (errorDetected === USERNAME_EXIST_IN_ROOM) {
        setErrorMessage(
          "Someone is already using this username. Try a different one"
        );
        setError(true);
        return;
      }
    }

    setError(false);

    history.push("/game/" + code, { username });
  };

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

      {error ? (
        <Alert key="danger" variant="danger">
          {errorMessage}
        </Alert>
      ) : (
        <div></div>
      )}

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
            <Button variant="primary" onClick={createRoom}>
              Create
            </Button>
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
            <Button variant="primary" onClick={joinRoom}>
              Join Room
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    </>
  );
};
