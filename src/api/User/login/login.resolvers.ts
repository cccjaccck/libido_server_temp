import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../../../client";
import { LoginResult } from "./login.typeDefs";

export default {
  Mutation: {
    login: async (_, args): Promise<LoginResult> => {
      const { email, password } = args;
      const account = await client.user.findUnique({ where: { email } });
      if (!account) {
        return {
          ok: false,
          error: "존재하지 않는 이메일입니다.",
        };
      }
      const isOk = await bcrypt.compareSync(password, account.password);
      if (isOk) {
        const token = await jwt.sign(
          { id: account.id },
          process.env.JWT_SECRET
        );
        return {
          ok: true,
          token,
        };
      } else {
        return {
          ok: false,
          error: "비밀번호가 일치하지 않습니다",
        };
      }
    },
  },
};
