import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    unfollow: protectedResolver(
      async (_, args, { loggedInUser }): Promise<MutationResponse> => {
        const { id } = args;
        try {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { disconnect: { id } } },
          });

          return {
            ok: true,
          };
        } catch {
          return {
            ok: false,
            error: "팔로우를 취소할 수 없습니다.",
          };
        }
      }
    ),
  },
};
