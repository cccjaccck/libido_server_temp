import { User } from ".prisma/client";
import client from "../../../client";

export default {
  Query: {
    seeViewers: async (_, { id }): Promise<User[]> =>
      client.room.findUnique({ where: { id } }).watching(),
  },
};
