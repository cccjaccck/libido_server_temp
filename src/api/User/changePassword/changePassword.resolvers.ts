import bcrypt from "bcryptjs";
import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    changePassword: protectedResolver(
      async (
        _,
        { password, confirm },
        { loggedInUser }
      ): Promise<MutationResponse> => {
        if (password !== confirm) {
          return {
            ok: false,
            error: "비밀번호가 서로 일치하지 않습니다.",
          };
        }

        try {
          const hashPassword = await bcrypt.hashSync(password, 10);
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { password: hashPassword },
          });
          return {
            ok: true,
          };
        } catch (e) {
          return {
            ok: false,
            error: "changePassword 에러",
          };
        }
      }
    ),
  },
};
