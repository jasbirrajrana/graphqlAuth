import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri: string = process.env.MONGO_URI as string;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connected....!!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectDB;
