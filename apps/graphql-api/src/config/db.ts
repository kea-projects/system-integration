import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI || 'nope');

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

mongoose.set("debug", true);

export default connectDB;