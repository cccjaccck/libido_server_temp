import bcrypt from "bcryptjs";
import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";

export default {
  Mutation: {
    createAccount: async (_, args): Promise<MutationResponse> => {
      const { email, username, password } = args;
      const emailExisting = await client.user.findUnique({ where: { email } });
      if (emailExisting) {
        return {
          ok: false,
          error: "이미 존재하는 이메일입니다.",
        };
      } else {
        const hashPassword = await bcrypt.hashSync(password, 10);
        await client.user.create({
          data: {
            email,
            username,
            password: hashPassword,
          },
        });
        return {
          ok: true,
        };
      }
    },
  },
};
