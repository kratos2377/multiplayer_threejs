import { HelloResolver } from "../resolvers/HelloResolver";
import { buildSchema } from "type-graphql";

export const createBuildSchema = () =>
  buildSchema({
    resolvers: [HelloResolver],
  });
