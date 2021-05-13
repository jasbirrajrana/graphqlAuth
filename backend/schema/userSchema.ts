import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  _id: string;

  @Field()
  @prop({ type: () => String, required: true, unique: true })
  email: string;

  @prop({ type: () => String, required: true })
  password: string;

  public static async getAllUsers(this: ReturnModelType<typeof User>) {
    return this.find({});
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
