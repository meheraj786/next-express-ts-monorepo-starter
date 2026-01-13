import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import { dbConnect } from "./database/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;
console.log();



(async () => {
  try {
    await dbConnect();
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(router);
    app.get("/", (req, res) => res.send("Working"));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Something went wrong:", error);
  }
})();