import React, { useState, useEffect } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useRoomDetailsQuery } from "../generated/graphql";
import { socket } from "../services/socket.js";
interface GameInfoScreenRoomIdProps {
  roomId: string;
}

interface GameInfoScreenRoomProps {
  username: string;
}

export const GameInfoScreen: React.FC<GameInfoScreenRoomProps> = ({
  username,
}) => {
  const { roomId } = useParams<GameInfoScreenRoomIdProps>();
  const [disableButton, setDisabled] = useState(true);

  const { data, error, loading } = useRoomDetailsQuery({
    variables: {
      roomCode: roomId,
    },
  });
  useEffect(() => {
    socket.emit("init", {
      x: 0,
      y: 0,
      z: 0,
      username: username,
      roomCode: roomId,
    });

    socket.emit("joinRoom", { roomId: roomId });
  }, [roomId, username]);

  socket.on("joined-room", function (data) {
    console.log("Total users");
    console.log(socket);
  });

  console.log(data);

  console.log(socket.io);

  const handleLeavingRoom = () => {};
  console.log(socket);
  return (
    <>
      {!loading ? (
        <>
          <h1>Game Lobby Users</h1>
          <Container>
            <Row>
              {data?.getRoomDetails?.adminSocketId?.toString() ===
              socket.id.toString() ? (
                <Button disabled>Start Game</Button>
              ) : (
                <div></div>
              )}
              <Button onClick={handleLeavingRoom}>Leave Lobby</Button>
            </Row>
          </Container>
        </>
      ) : (
        <Spinner animation="border" variant="dark" />
      )}
    </>
  );
};
