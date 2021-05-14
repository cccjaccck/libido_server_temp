import client from "../../../client";
import { protectedResolver } from "../users.utils";
import { SeeStaticResult } from "./seeStat.typeDefs";

export default {
  Query: {
    seeStat: protectedResolver(
      async (_, { id, time }, { loggedInUser }): Promise<SeeStaticResult> => {
        let date;
        if (time === "DAY") {
          date = new Date(Date.now() - 1000 * 60 * 60 * 24);
        } else if (time === "WEEK") {
          date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
        } else {
          date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
        }

        try {
          const totalComments = await client.message.count({
            where: {
              room: { hostId: id ?? loggedInUser.id },
              createdAt: { gte: date },
            },
          });
          const totalRooms = await client.room.count({
            where: { hostId: id ?? loggedInUser.id, createdAt: { gte: date } },
          });
          const totalVideos = await client.video.count({
            where: { userId: id ?? loggedInUser.id, createdAt: { gte: date } },
          });
          const {
            sum: { watchingTime: totalWatchingTime },
          } = await client.room.aggregate({
            where: { hostId: id ?? loggedInUser.id, createdAt: { gte: date } },
            sum: { watchingTime: true },
          });

          return {
            totalComments: totalComments ?? 0,
            totalRooms: totalRooms ?? 0,
            totalVideos: totalVideos ?? 0,
            totalWatchingTime: Math.round(totalWatchingTime / 3600) ?? 0,
          };
        } catch (e) {
          console.log("seeStat 에러: ", e);
        }
      }
    ),
  },
};
