import { PrismaClient } from "@prisma/client";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import express from "express";
import schema from "./schema";
import "./passport";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares";

const PORT = process.env.PORT || 4000;

export const prisma = new PrismaClient();

// export const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req, isAuthenticated }),
  playground: process.env.PLAYGROUND === "true",
});
const app = express();

app.use(logger("dev"));
app.use(authenticateJwt);
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `📺  The Libido Server is running on port http://localhost:${PORT}`
  )
);
