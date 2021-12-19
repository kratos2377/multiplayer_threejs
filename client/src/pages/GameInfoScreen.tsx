import React, { useState, useEffect } from "react";
import { Button, Container, Row, Spinner, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  useGetLobbyDetailsQuery,
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
  const [dom_content, setDomContent] = useState<Array<JSX.Element>>([]);
  const [allUsers, setAllUsers] = useState<
    Array<{
      id: string;
      username: string;
    }>
  >([]);
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

  const {
    data: lobbyData,
    error: lobbyError,
    loading: lobbyLoading,
  } = useGetLobbyDetailsQuery({
    variables: {
      roomCode: roomId,
    },
  });

  console.log("TIMES");

  socket.emit("init", {
    x: 0,
    y: 0,
    z: 0,
    username: username,
    roomCode: roomId,
  });

  // socket.emit("joinRoom", {
  //   roomId: roomId,
  //   users: 2,
  // });
  // setTotalUsers(roomData?.getNumberofUsersInRoom!);

  socket.on("joined-room", function (data) {
    console.log("Total users");
    console.log(socket);
  });

  socket.on("someone-joined", function (data) {
    setTotalUsers(data.users);

    if (totalUsers > 2) {
      setNewDisabled(false);
    }
    let newAllusers: Array<{
      id: string;
      username: string;
    }> = [...allUsers, { id: data.id, username: data.username }];
    setAllUsers(newAllusers);
    renderTable();
  });

  const handleLeavingRoom = () => {};

  const renderTable = () => {
    let dom_content_copy: JSX.Element[] = [];
    for (var i = 1; i <= 16; i += 2) {
      dom_content_copy.push(
        <tr>
          <td>{i} </td>
          <td>
            {i + 1} {"   somename1"}
          </td>
        </tr>
      );
    }
    console.log("DOM CONTENT");
    console.log(dom_content_copy);

    setDomContent(dom_content_copy);
  };

  useEffect(() => {
    renderTable();
  }, []);

  //renderTable();

  return (
    <>
      {!loading && !roomLoading && !roomLoading ? (
        <div>
          <h3>Game Lobby Users</h3>
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
