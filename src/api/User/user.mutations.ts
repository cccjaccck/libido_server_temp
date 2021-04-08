import { User } from ".prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../server";

export default {
  Mutation: {
    createAccount: async (_, args): Promise<User> => {
      const { email, username, password } = args;
      const emailExisting = await prisma.user.findUnique({ where: { email } });
      if (emailExisting) {
        throw Error("이미 존재하는 이메일입니다.");
      } else {
        const hashPassword = await bcrypt.hashSync(password, 10);
        const newUser: User = await prisma.user.create({
          data: {
            email,
            username,
            password: hashPassword,
          },
        });
        return newUser;
      }
    },
    login: async (_, args): Promise<string> => {
      const { email, password } = args;
      const account = await prisma.user.findUnique({ where: { email } });
      if (!account) {
        throw new Error("존재하지 않는 이메일입니다.");
      }
      const isOk = await bcrypt.compareSync(password, account.password);
      if (isOk) {
        return await jwt.sign({ id: account.id }, process.env.JWT_SECRET);
      } else {
        throw new Error("비밀번호가 일치하지 않습니다");
      }
    },
    follow: async (_, args, { req, isAuthenticated }): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { id } = args;
      try {
        if (user.id === id) throw Error;

        await prisma.user.update({
          where: { id: user.id },
          data: { following: { connect: { id } } },
        });
        return true;
      } catch {
        return false;
      }
    },
    unfollow: async (_, args, { req, isAuthenticated }): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { id } = args;
      try {
        if (user.id === id) throw Error;

        await prisma.user.update({
          where: { id: user.id },
          data: { following: { disconnect: { id } } },
        });

        return true;
      } catch {
        return false;
      }
    },
    changePassword: async (
      _,
      args,
      { req, isAuthenticated }
    ): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { password, confirm } = args;
      if (password !== confirm)
        throw Error("비밀번호가 서로 일치하지 않습니다.");

      try {
        const hashPassword = await bcrypt.hashSync(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashPassword },
        });
        return true;
      } catch (e) {
        console.log("changePassword 에러: ", e);
        return false;
      }
    },
  },
};
