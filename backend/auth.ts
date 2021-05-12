import { sign } from "jsonwebtoken";
import { User } from "./schema/userSchema";

const jwtSecret: string = process.env.ACCESS_TOKEN_SECRET as string;
const cookieSecret: string = process.env.REFRESH_TOKEN_SECRET as string;

export const createRefreshToken = (user: User) => {
  return sign({ userId: user._id }, cookieSecret, {
    expiresIn: "7d",
  });
};

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    jwtSecret,
    {
      expiresIn: "15m",
    }
  );
};
