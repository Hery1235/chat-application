import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Connected To Database")
    );
    mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.log("Error in connectin database ", error);
  }
};

export default connectDb;
