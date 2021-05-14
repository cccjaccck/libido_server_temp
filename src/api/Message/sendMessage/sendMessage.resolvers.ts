import client from "../../../client";
import { NEW_MESSAGE } from "../../../constants";
import pubsub from "../../../pubsub";
import { protectedResolver } from "../../User/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { hostId, text }, { loggedInUser }) => {
        const room = await client.room.findUnique({
          where: { hostId_isLive: { hostId, isLive: true } },
        });
        if (
          loggedInUser.watchingRoomId !== room.id &&
          hostId !== loggedInUser.id
        ) {
          return {
            ok: false,
            error: "해당 방에 참석하고 있지 않습니다.",
          };
        }
        if (!room) {
          return {
            ok: false,
            error: "존재하지 않는 방입니다.",
          };
        }
        const message = await client.message.create({
          data: {
            text,
            user: { connect: { id: loggedInUser.id } },
            room: {
              connect: {
                hostId_isLive: {
                  hostId,
                  isLive: true,
                },
              },
            },
          },
          include: { user: true, room: { select: { hostId: true } } },
        });
        pubsub.publish(NEW_MESSAGE, { messageUpdates: message });
        return {
          ok: true,
          id: message.id,
        };
      }
    ),
  },
};
