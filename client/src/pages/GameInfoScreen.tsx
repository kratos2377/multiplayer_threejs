import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { RouteComponentProps, useLocation, useParams } from "react-router-dom";
import {
  useGetLobbyDetailsQuery,
  useLeaveRoomMutation,
  useNumberOfUsersInRoomQuery,
  useRoomDetailsQuery,
} from "../generated/graphql";
import { socket } from "../services/socket.js";
interface GameInfoScreenRoomIdProps {
  roomId: string;
}

interface GameInfoScreenRoomProps extends RouteComponentProps {}

// interface LocationState extends RouteComponentProps <{location: {state: {username: 'value'}}}> {

// }

export const GameInfoScreen: React.FC<GameInfoScreenRoomProps> = ({
  history,
}) => {
  const { roomId } = useParams<GameInfoScreenRoomIdProps>();
  const location = useLocation<{ username: "value"; socketId: "value" }>();

  const [totalUsers, setTotalUsers] = useState(0);
  const [newDisabled, setNewDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [leaveRoom] = useLeaveRoomMutation();
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

  // const {
  //   data: roomData,
  //   error: roomError,
  //   loading: roomLoading,
  // } = useNumberOfUsersInRoomQuery({
  //   variables: {
  //     roomCode: roomId,
  //   },
  // });

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

  const changeArray = async (
    newAllusers: Array<{
      id: string;
      username: string;
    }>
  ) => {
    setAllUsers(newAllusers);
  };

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
    username: location.state.username,
    roomCode: roomId,
  });

  useEffect(() => {
    const renderEffectFunction = async () => {
      if (!lobbyLoading && lobbyData) {
        console.log(lobbyData);
        console.log(location.state.username);
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
        await changeArray(newAllusers);
        renderTable();
      }
    };

    renderEffectFunction();
  }, [lobbyLoading]);

  useEffect(() => {
    if (!loading) {
      if (data === null || lobbyData === null) {
        console.log("DASDASD");
        setErrorMessage("Room Doesn't Exist.");
        setShowModal(true);
      }
    }
  }, [loading]);

  // socket.on("joined-room", function (data) {
  //   console.log("Total users");
  //   console.log(socket);
  // });

  //MOst Probably problem is here

  socket.on("someone-joined", async function (data) {
    setTotalUsers(data.users);

    if (totalUsers > 2) {
      setNewDisabled(false);
    }
    let newAllusers: Array<{
      id: string;
      username: string;
    }> = [...allUsers, { id: data.id, username: data.username }];
    await changeArray(newAllusers);
    console.log("New Users");
    console.log(newAllusers);

    renderTable();
  });

  const startTheGame = () => {};

  const sendToHomePage = () => {
    setShowModal(false);
    history.push("/");
  };

  const handleLeavingRoom = async () => {
    socket.emit("leaveRoom", {
      roomId: roomId,
      users: totalUsers - 1,
    });

    setTotalUsers(totalUsers - 1);

    if (data?.getRoomDetails?.adminSocketId === location.state.socketId) {
      socket.emit("throw-all-users-out-of-room", {
        roomId: roomId,
      });
    }

    const values = {
      id: location.state.socketId,
      roomCode: roomId,
    };

    await leaveRoom({ variables: values });
  };

  socket.on("throw-room-recieved", function (data) {
    console.log("THROW DATA RECIEVED");
    console.log(data);
  });

  // useEffect(() => {
  //   renderTable();
  // }, []);

  //renderTable();
  //console.log(lobbyData);
  // console.log(dom_content);
  return (
    <>
      {!loading && !lobbyLoading ? (
        <>
          <Modal show={showModal}>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Error..!!</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>{errorMessage}</p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={sendToHomePage}>
                  Go To Home Page
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal>

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
        </>
      ) : (
        <Spinner animation="border" variant="dark" />
      )}
    </>
  );
};
