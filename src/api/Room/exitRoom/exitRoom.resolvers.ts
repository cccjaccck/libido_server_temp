import client from "../../../client";
import { NEW_EXIT } from "../../../constants";
import pubsub from "../../../pubsub";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../../User/users.utils";

export default {
  Mutation: {
    exitRoom: protectedResolver(
      async (_, __, { loggedInUser }): Promise<MutationResponse> => {
        try {
          const { id, watchingRoomId, enterTime } = loggedInUser;
          if (!watchingRoomId) {
            return {
              ok: false,
              error: "해당 방에 참여하고 있지 않습니다.",
            };
          }

          const room = await client.room.findUnique({
            where: { id: watchingRoomId },
          });

          if (room.hostId !== loggedInUser.id) {
            await client.user.update({
              where: { id },
              data: { watching: { disconnect: true }, enterTime: null },
            });
            const viewTime = Math.round(
              (Date.now() - enterTime.getTime()) / 1000
            );
            await client.room.update({
              where: { id: watchingRoomId },
              data: { watchingTime: { increment: viewTime } },
            });
          } else {
            const watchings = await client.room
              .findUnique({ where: { id: watchingRoomId } })
              .watching();
            let totalViewTime = 0;
            for (let user of watchings) {
              if (user.id !== loggedInUser.id) {
                const viewTime = Math.round(
                  (Date.now() - user.enterTime.getTime()) / 1000
                );
                totalViewTime += viewTime;
              }
              await client.user.update({
                where: { id: user.id },
                data: { watching: { disconnect: true }, enterTime: null },
              });
            }

            await client.room.update({
              where: { id: watchingRoomId },
              data: {
                watchingTime: { increment: totalViewTime },
                isLive: null,
              },
            });
          }

          pubsub.publish(NEW_EXIT, { exitUpdates: loggedInUser });

          return {
            ok: true,
          };
        } catch (e) {
          console.log(e);
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
