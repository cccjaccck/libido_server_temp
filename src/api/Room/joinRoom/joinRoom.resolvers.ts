import client from "../../../client";
import { NEW_JOIN } from "../../../constants";
import pubsub from "../../../pubsub";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../../User/users.utils";

export default {
  Mutation: {
    joinRoom: protectedResolver(
      async (
        _,
        { id, password },
        { loggedInUser }
      ): Promise<MutationResponse> => {
        const room = await client.room.findUnique({ where: { id } });
        // if (id === loggedInUser.watchingRoomId) {
        //   return {
        //     ok: false,
        //     error: "이미 방에 참여하고 있습니다.",
        //   };
        // }
        if (!room) {
          return {
            ok: false,
            error: "존재하지 않는 방입니다.",
          };
        } else if (!room.isLive) {
          return {
            ok: false,
            error: "방 준비중입니다.",
          };
        } else if (
          room.password &&
          room.password !== "" &&
          room.password !== password
        ) {
          return {
            ok: false,
            error: "방 비밀번호가 일치하지 않습니다.",
          };
        }

        try {
          await client.room.update({
            where: { id },
            data: {
              users: { connect: { id: loggedInUser.id } },
              watching: { connect: { id: loggedInUser.id } },
            },
          });

          const me = await client.user.update({
            where: { id: loggedInUser.id },
            data: { enterTime: new Date() },
          });
          await pubsub.publish(NEW_JOIN, { joinUpdates: me });
          return {
            ok: true,
          };
        } catch (e) {
          console.log("joinRoom 에러: ", e);
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
