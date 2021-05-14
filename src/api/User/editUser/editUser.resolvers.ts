import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../users.utils";
import bcrypt from "bcryptjs";

export default {
  Mutation: {
    editUser: protectedResolver(
      async (
        _,
        { username, password },
        { loggedInUser }
      ): Promise<MutationResponse> => {
        try {
          const hashPassword = await bcrypt.hashSync(password, 10);
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { username, password: hashPassword },
          });
          return {
            ok: true,
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
