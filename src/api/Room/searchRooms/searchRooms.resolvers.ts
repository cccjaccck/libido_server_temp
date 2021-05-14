import { Room } from ".prisma/client";
import client from "../../../client";

export default {
  Query: {
    searchRooms: async (_, args): Promise<Room[]> => {
      const { term } = args;
      return await client.room.findMany({
        where: {
          isLive: true,
          OR: [
            { title: { contains: term } },
            { host: { username: { contains: term } } },
          ],
        },
        orderBy: { users: { count: "desc" } },
        include: { host: true, videos: true },
      });
    },
  },
};
