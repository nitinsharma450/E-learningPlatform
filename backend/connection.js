import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export var DB_connect;

try {
  DB_connect = await mongoose.connect(process.env.MONOGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("databases connected successfully");
} catch (error) {
  console.log(error);
}
