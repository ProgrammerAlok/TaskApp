import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
