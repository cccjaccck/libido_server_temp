import client from "../../client";
import { protectedResolver } from "./users.utils";

export default {
  User: {
    isFollowing: protectedResolver(
      async ({ id }, _, { loggedInUser }): Promise<boolean> => {
        if (!loggedInUser) {
          return false;
        }
        const exists = await client.user.count({
          where: {
            username: loggedInUser.username,
            following: {
              some: {
                id,
              },
            },
          },
        });
        return Boolean(exists);
      }
    ),
    isMe: protectedResolver((par, _, { loggedInUser }): boolean =>
      loggedInUser ? par.id === loggedInUser.id : false
    ),
    viewCount: async (_, __, { loggedInUser }): Promise<number> => {
      const {
        sum: { watchingTime: totalWatchingTime },
      } = await client.room.aggregate({
        where: { hostId: loggedInUser.id },
        sum: { watchingTime: true },
      });
      return Math.round(totalWatchingTime / 3600);
    },
    followingCount: async (_, __, { loggedInUser }): Promise<number> => {
      return client.user.count({
        where: { follower: { some: { id: loggedInUser.id } } },
      });
    },
  },
};
