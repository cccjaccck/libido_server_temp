import client from "../../../client";
import { TAKE } from "../../../constants";
import { protectedResolver } from "../users.utils";
import { SearchUserResult } from "./searchUsers.typeDefs";

export default {
  Query: {
    searchUsers: protectedResolver(
      async (
        _,
        { term, page },
        { loggedInUser }
      ): Promise<SearchUserResult> => {
        const whereFilter = {
          id: { not: loggedInUser.id },
          username: { contains: term },
        };
        try {
          const users = await client.user.findMany({
            where: whereFilter,
            skip: page && ((page - 1) * TAKE ?? 0),
            take: TAKE,
            orderBy: { username: "asc" },
          });
          const totalUsers = await client.user.count({ where: whereFilter });
          return {
            ok: true,
            users,
            totalPages: Math.ceil(totalUsers / TAKE),
          };
        } catch (e) {
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
