import { withFilter } from "graphql-subscriptions";
import client from "../../../client";
import { NEW_MESSAGE } from "../../../constants";
import pubsub from "../../../pubsub";

export default {
  Subscription: {
    messageUpdates: {
      subscribe: (root, args, context, info) => {
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async (payload, { hostId }) => {
            const room = await client.room.findUnique({
              where: { hostId_isLive: { hostId, isLive: true } },
            });
            return payload.messageUpdates.room.hostId === room.hostId;
          }
        )(root, args, context, info);
      },
    },
  },
};
