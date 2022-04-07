import dotenv from "dotenv";
dotenv.config();
import express from "express";

//? cors policy
import cors from "cors";

// ?dbconnectin func called
import dbconnection from "./config/dbconnection.js";
//? for handle routes
import userRoutes from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

dbconnection(DATABASE_URL);

//? for json api
app.use(express.json());

// ? middleware for routes
app.use("/api/user", userRoutes);

app.listen(port, () => console.log(`listening on port ${port}`));
