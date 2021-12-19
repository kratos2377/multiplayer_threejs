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
  console.log(roomId);
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

  const renderTable = () => {
    let dom_content_copy: JSX.Element[] = [];
    for (var i = 0; i < allUsers.length; i += 2) {
      dom_content_copy.push(
        <tr>
          <td>
            {i + 1} {` ${allUsers[i].username}`}{" "}
          </td>
          {i + 1 < allUsers.length ? (
            <td>
              {i + 2} {` ${allUsers[i + 1].username}`}
            </td>
          ) : (
            <td></td>
          )}
        </tr>
      );
    }
    // console.log("DOM CONTENT");
    // console.log(dom_content_copy);

    setDomContent(dom_content_copy);
  };

  socket.emit("init", {
    x: 0,
    y: 0,
    z: 0,
    username: username,
    roomCode: roomId,
  });

  useEffect(() => {
    if (!lobbyLoading && lobbyData) {
      console.log(lobbyData);

      socket.emit("joinRoom", {
        roomId: roomId,
        users: lobbyData?.getLobbyDetails?.length,
      });

      setTotalUsers(lobbyData?.getLobbyDetails?.length);
      let newAllusers: Array<{
        id: string;
        username: string;
      }> = [];
      for (var i = 0; i < lobbyData?.getLobbyDetails?.length; i++) {
        newAllusers.push({
          id: lobbyData?.getLobbyDetails[i]?.userId,
          username: lobbyData?.getLobbyDetails[i]?.username,
        });
      }
      setAllUsers(newAllusers);
      renderTable();
    }
  }, [lobbyLoading, lobbyData]);

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
  const startTheGame = () => {};

  // useEffect(() => {
  //   renderTable();
  // }, []);

  //renderTable();
  console.log(lobbyData);
  // console.log(dom_content);
  return (
    <>
      {!loading && !lobbyLoading ? (
        <div>
          <h3>Game Lobby Users</h3>
          <div className="display: inline">
            <span className="float: right">
              <h3>The Room Code is- </h3>
              {roomId}
            </span>
            <p></p>
          </div>
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
                  <Button onClick={startTheGame}>Start Game</Button>
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
