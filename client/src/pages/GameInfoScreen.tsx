import React, { useState, useEffect } from "react";
import { Button, Container, Row, Spinner, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  useNumberOfUsersInRoomQuery,
  useRoomDetailsQuery,
} from "../generated/graphql";
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [newDisabled, setNewDisabled] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const { data, error, loading } = useRoomDetailsQuery({
    variables: {
      roomCode: roomId,
    },
  });

  const {
    data: roomData,
    error: roomError,
    loading: roomLoading,
  } = useNumberOfUsersInRoomQuery({
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

    socket.emit("joinRoom", {
      roomId: roomId,
      users: roomData?.getNumberofUsersInRoom,
    });
  }, [roomId, username]);

  useEffect(() => {
    if (!loading && !roomLoading) {
      setTotalUsers(roomData?.getNumberofUsersInRoom!);
    }
  }, [loading, roomLoading]);

  socket.on("joined-room", function (data) {
    console.log("Total users");
    console.log(socket);
  });

  socket.on("someone-joined", function (data) {
    setTotalUsers(data.users);

    if (totalUsers > 2) {
      setNewDisabled(false);
    }
  });

  const handleLeavingRoom = () => {};

  var dom_content = [];
  const renderTable = () => {
    dom_content = [];
    for (var i = 1; i <= 16; i += 2) {
      dom_content.push(
        <tr>
          <td>{i} </td>
          <td>
            {i + 1} {"   somename1"}
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      {!loading && !roomLoading ? (
        <div>
          <h1>Game Lobby Users</h1>
          <h3>The Room Code is- {roomId}</h3>
          <h3>Players in Lobby: {totalUsers}/16</h3>
          <div className="col-xs-6">
            <Row className="flex" sm={3} md={2} lg={2}>
              <Table striped bordered size="sm">
                <tbody>{dom_content}</tbody>
              </Table>
            </Row>

            <Container>
              <Row>
                {data?.getRoomDetails?.adminSocketId?.toString() ===
                socket.id.toString() ? (
                  <Button>Start Game</Button>
                ) : (
                  <div></div>
                )}
                <Button onClick={handleLeavingRoom}>Leave Lobby</Button>
              </Row>
            </Container>
          </div>
        </div>
      ) : (
        <Spinner animation="border" variant="dark" />
      )}
    </>
  );
};
