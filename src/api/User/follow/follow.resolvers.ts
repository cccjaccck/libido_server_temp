import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    follow: protectedResolver(
      async (_, args, { loggedInUser }): Promise<MutationResponse> => {
        const { id } = args;
        try {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { connect: { id } } },
          });
          return {
            ok: true,
          };
        } catch (e) {
          return {
            ok: false,
            error: "팔로우 할 수 없습니다.",
          };
        }
      }
    ),
  },
};
