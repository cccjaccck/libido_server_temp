import client from "../../../client";
import { protectedResolver } from "../../User/users.utils";

export default {
  Mutation: {
    startLive: protectedResolver(
      async (_, args, { loggedInUser }): Promise<Boolean> => {
        const { id } = args;
        const room = await client.room.findUnique({ where: { id } });
        if (room.hostId !== loggedInUser.id) {
          throw Error("권한이 없습니다.");
        }
        try {
          await client.room.update({ where: { id }, data: { isLive: true } });
          return true;
        } catch (e) {
          console.log("startLive 에러: ", e);
          return false;
        }
      }
    ),
  },
};
