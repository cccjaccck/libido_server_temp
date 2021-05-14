import { User } from ".prisma/client";
import client from "../../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    seeMe: protectedResolver(
      async (_, __, { loggedInUser }): Promise<User> => {
        try {
          const me = await client.user.findUnique({
            where: { id: loggedInUser.id },
          });

          return me;
        } catch (e) {
          console.log("seeMe 에러: ", e);
        }
      }
    ),
  },
};
