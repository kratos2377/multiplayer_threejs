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
  app.listen(port, () => console.log("SERVER STARTED AT PORT " + port));
  // const io = require("socket.io")(httpServer);
  // console.log("THIS IS IO");
  // console.log(io);
};

main().catch((err) => console.log(err));
