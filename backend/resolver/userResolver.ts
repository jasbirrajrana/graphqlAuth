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
import { verify } from "jsonwebtoken";
import { sendRefreshToken } from "../sendRefreshToken";

// class for error handling

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// class for userResponse

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  accessToken?: string;
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
    return `hi there this is :${payload?.userId}`;
  }

  @Query(() => [User])
  async users() {
    return await UserModel.getAllUsers();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return UserModel.findById(payload.userId);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const userExist = await UserModel.findOne({ email });
    if (userExist === null) {
      return {
        errors: [
          {
            field: "email",
            message: "could not find a user with provided Email id!",
          },
        ],
      };
    }
    const valid = await compare(password, userExist.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password is not matching!",
          },
        ],
      };
    }
    // login successfully
    sendRefreshToken(res, createRefreshToken(userExist));
    return {
      accessToken: createAccessToken(userExist),
      user: userExist,
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ): Promise<UserResponse> {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is Already in Use!",
          },
        ],
      };
    }
    if (password.length <= 4) {
      return {
        errors: [
          {
            field: "password",
            message: "password length must be greater than 4",
          },
        ],
      };
    }
    const hashedPassword = await hash(password, 12);
    const user = await UserModel.create({ email, password: hashedPassword });
    return { user };
  }
}
