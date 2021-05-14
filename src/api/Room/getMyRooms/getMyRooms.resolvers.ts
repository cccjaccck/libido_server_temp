import { Room } from ".prisma/client";
import client from "../../../client";
import { protectedResolver } from "../../User/users.utils";

export default {
  Query: {
    getMyRooms: protectedResolver(
      async (_, __, { loggedInUser }): Promise<Room[]> => {
        try {
          const rooms = await client.room.findMany({
            where: { hostId: loggedInUser.id },
            include: { videos: true },
          });

          return rooms;
        } catch (e) {
          console.log("getMyRooms 에러: ", e);
        }
      }
    ),
  },
};
