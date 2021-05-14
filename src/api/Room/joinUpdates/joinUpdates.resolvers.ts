import { withFilter } from "graphql-subscriptions";
import client from "../../../client";
import { NEW_JOIN } from "../../../constants";
import pubsub from "../../../pubsub";

export default {
  Subscription: {
    joinUpdates: {
      subscribe: (root, args, context, info) => {
        return withFilter(
          () => pubsub.asyncIterator(NEW_JOIN),
          async (payload, { hostId }) => {
            const room = await client.room.findUnique({
              where: { hostId_isLive: { hostId, isLive: true } },
            });
            return payload.joinUpdates.watchingRoomId === room.id;
          }
        )(root, args, context, info);
      },
    },
  },
};
