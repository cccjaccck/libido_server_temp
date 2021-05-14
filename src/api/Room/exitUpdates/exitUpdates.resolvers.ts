import { withFilter } from "graphql-subscriptions";
import client from "../../../client";
import { NEW_EXIT } from "../../../constants";
import pubsub from "../../../pubsub";

export default {
  Subscription: {
    exitUpdates: {
      subscribe: (root, args, context, info) => {
        return withFilter(
          () => pubsub.asyncIterator(NEW_EXIT),
          async (payload, { hostId }) => {
            const room = await client.room.findUnique({
              where: { hostId_isLive: { hostId, isLive: true } },
            });
            return payload.exitUpdates.watchingRoomId === room.id;
          }
        )(root, args, context, info);
      },
    },
  },
};
