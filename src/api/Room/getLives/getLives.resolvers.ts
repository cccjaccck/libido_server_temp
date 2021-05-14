import { Room } from ".prisma/client";
import client from "../../../client";

export default {
  Query: {
    getLives: async (): Promise<Room[]> => {
      return await client.room.findMany({
        where: { isLive: true },
        orderBy: { users: { count: "desc" } },
        take: 10,
        include: { videos: true, host: true },
      });
    },
  },
};
