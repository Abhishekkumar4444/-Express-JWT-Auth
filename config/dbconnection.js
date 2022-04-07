import mongoose from "mongoose";

const dbconnection = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "userDB",
    };

    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("mongoose is connected...."); //?for production level
  } catch (error) {
    console.log(error);
  }
};

export default dbconnection;
