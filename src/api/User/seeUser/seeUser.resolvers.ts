import { User } from ".prisma/client";
import client from "../../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    seeUser: protectedResolver(
      async (_, { id }): Promise<User> => {
        try {
          const user = await client.user.findUnique({
            where: { id },
          });

          return user;
        } catch (e) {
          console.log("seeMe 에러: ", e);
        }
      }
    ),
  },
};
