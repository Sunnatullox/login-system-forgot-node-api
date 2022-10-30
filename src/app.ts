import express, { Application, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import { errorHandler } from "./middleware/errorHanlder";
import Cors from "cors";
import userRoutes from "./routes/userRoutes";
const app:Application = express();



app.use(express.json());
app.use(errorHandler);
app.use(Cors())

app.use(() => {
  throw createHttpError(404, "Route not found");
});
app.use("/api", userRoutes);
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to mongoDb");
    app.listen(PORT, () => {
      console.log(`Listening On PORT ${PORT}`);
    });
  })
  .catch(() => {
    throw createHttpError(501, "Unable to connect database");
  });