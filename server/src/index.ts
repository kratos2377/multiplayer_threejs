import "reflect-metadata";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import Express from "express";
import { createBuildSchema } from "./utils/createSchema";
import { ApolloServer } from "apollo-server-express";

import cors from "cors";
import { Lobby } from "./entity/Lobby";
import { Room } from "./entity/Room";
import { User } from "./entity/User";
import { Socket } from "socket.io";

interface ExtSocket extends Socket {
  username: string;
  x: number;
  y: number;
  z: number;
  roomCode: string;
  healthPoints: number;
  attackPoints: number;
}

const main = async () => {
  dotenv.config();

  await createConnection({
    type: "postgres",
    database: "multiplayer",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [User, Lobby, Room],
    // extra: {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // },
  });

  const app = Express();
  app.set("trust proxy", 1);

  const schema = await createBuildSchema();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  // app.use(
  //   session({
  //     store: new RedisStore({
  //       client: redis as any,
  //       disableTouch: true
  //     }),
  //     name: 'qid',
  //     secret: 'aslkdfjoiq12312',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       path: '/',
  //       httpOnly: true,
  //       secure: false,
  //       maxAge: 1000 * 60 * 60 * 24 * 90 // 90 Days
  //     }
  //   })
  // );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });
  //await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 5000;
  const httpServer = app.listen(port, () =>
    console.log("SERVER STARTED AT PORT " + port)
  );
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: ["https://localhost:3000"],
    },
  });
  // console.log("THIS IS IO");
  // console.log(io);
  io.on("connection", function (socket: ExtSocket) {
    console.log(socket);
    socket.emit("setId", { id: socket.id });
    socket.on("init", function (data) {
      socket.x = 0;
      socket.y = 0;
      socket.z = 0;
      socket.username = data.username;
      socket.roomCode = data.roomCode;
    });

    socket.on("joinRoom", function (data) {
      socket.join(data.roomId);
      socket.broadcast.to(data.roomId).emit("someone-joined", {
        id: socket.id,
        username: socket.username,
      });
    });

    socket.on("leaveRoom", function (data) {
      socket.leave(data.roomId);
      socket.broadcast.to(data.roomId).emit("someone-leaved", {
        id: socket.id,
        username: socket.username,
      });

      //Somehow we have to implement to add a resolver so that we can delete
      //the lobby and room from here and kick rest of the users out

      if (data.adminSocketId === socket.id) {
      }
    });

    socket.on("gameStart", function (data) {
      socket.healthPoints = data.healthPoints;
      socket.attackPoints = data.attackPoints;
    });

    // socket.on("update" , function(data) {

    // });
  });
};

main().catch((err) => console.log(err));
