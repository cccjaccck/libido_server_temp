import { User } from ".prisma/client";
import jwt from "jsonwebtoken";
import client from "../../client";

interface jwtResult {
  id: string;
}

export const getUser = async (token): Promise<User> => {
  try {
    if (!token) {
      return null;
    }
    const info = await jwt.verify(token, process.env.JWT_SECRET);
    if (typeof info === "string") {
      return null;
    } else {
      const user = await client.user.findUnique({
        where: { id: (info as jwtResult).id },
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    }
  } catch {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
}
