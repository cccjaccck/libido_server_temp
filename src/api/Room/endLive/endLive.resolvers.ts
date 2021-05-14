import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../../User/users.utils";

export default {
  Mutation: {
    endLive: protectedResolver(
      async (_, args, { loggedInUser }): Promise<MutationResponse> => {
        const { id } = args;
        const room = await client.room.findUnique({ where: { id } });
        if (room.hostId !== loggedInUser.id) {
          return {
            ok: false,
            error: "권한이 없습니다.",
          };
        }
        try {
          await client.user.updateMany({
            where: { watchingRoomId: id },
            data: { watchingRoomId: null },
          });
          await client.room.update({ where: { id }, data: { isLive: null } });
          return {
            ok: true,
          };
        } catch (e) {
          console.log("startLive 에러: ", e);
          return { ok: false, error: e.message };
        }
      }
    ),
  },
};
