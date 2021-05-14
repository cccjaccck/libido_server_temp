import client from "../../../client";
import { protectedResolver } from "../../User/users.utils";

export default {
  Query: {
    recentVideos: protectedResolver(async (_, __, { loggedInUser }) => {
      return client.user
        .findUnique({ where: { id: loggedInUser.id } })
        .videos({ orderBy: { createdAt: "desc" } });
    }),
  },
};
