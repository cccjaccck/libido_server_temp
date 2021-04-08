import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./server";
import {
  RequestWithUser,
  ResponseWithUser,
} from "./definitions/payload.interface";

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export const authenticateJwt = (
  req: RequestWithUser,
  res: ResponseWithUser,
  next: Function
) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error) {
      console.log(error);
    }
    if (user) {
      const { email, username, id } = user;
      req.user = { email, username, id };
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOption, verifyUser));
passport.initialize();
