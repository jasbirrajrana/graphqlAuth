import UserModel, { User } from "../schema/userSchema";
import { hash, compare } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../myContext";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  // @Field(() => User)
  // user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "type-graphql";
  }
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `hi there this is :${payload?.userId}`;
  }
  @Query(() => [User])
  async users() {
    return await UserModel.getAllUsers();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      throw new Error("User not Found!");
    }
    const valid = await compare(password, userExist.password);
    if (!valid) {
      throw new Error("Invalid User!");
    }
    // login successfully
    res.cookie("qid", createRefreshToken(userExist), { httpOnly: true });
    return {
      accessToken: createAccessToken(userExist),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ) {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new Error("User already exist!");
    }
    const hashedPassword = await hash(password, 12);
    try {
      await UserModel.create({ email, password: hashedPassword });
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
}
