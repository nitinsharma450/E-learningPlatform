import mongoose from "mongoose";

export var DB_connect;

try {
  DB_connect = await mongoose.connect("mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("databases connected successfully");
} catch (error) {
  console.log(error);
}
