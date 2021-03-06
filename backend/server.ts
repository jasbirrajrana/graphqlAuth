import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver/userResolver";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import UserModel from "./schema/userSchema";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
(async () => {
  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.qid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      console.log(error);

      return res.send({ ok: false, accessToken: "" });
    }
    //token is valid and we can send back an access token
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });
  const port: any = process.env.PORT;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  connectDB();
  app.listen(port, () => {
    console.log(`express server start at ${port} `);
  });
})();
