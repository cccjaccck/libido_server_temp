import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import logger from "morgan";
import http from "http";
import express from "express";
import schema from "./schema";
import { getUser } from "./api/User/users.utils";

const PORT = process.env.PORT || 4000;

const apollo = new ApolloServer({
  schema,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }: any) => {
      if (!token) {
        throw new Error("토큰을 읽을 수 없습니다.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
  playground: process.env.PLAYGROUND === "true",
  uploads: false,
});

const app = express();
app.use(logger("dev"));
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  console.log(
    `📺  The Libido Server is running on port http://localhost:${PORT}`
  );
});
