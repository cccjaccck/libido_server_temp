import { User } from ".prisma/client";
import client from "../../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    getMyFriends: protectedResolver(
      async (_, __, { loggedInUser }): Promise<User[]> => {
        try {
          const friends = await client.user
            .findUnique({ where: { id: loggedInUser.id } })
            .following();
          return friends;
        } catch (e) {
          console.log("getMyFriends 에러: ", e);
        }
      }
    ),
  },
};
