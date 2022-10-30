import express, { Application } from "express";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import { errorHandler } from "./middleware/errorHanlder";
import morgan from "morgan";
import Cors from "cors";
import userRoutes from "./routes/userRoutes";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from './swaggerOptionDocs.json'

const app: Application = express();
app.use(express.json());
app.use(errorHandler);
app.use(Cors());
app.use(morgan("dev"));

// app.use(() => {
//   throw createHttpError(404, "Route not found");
// });



app.use("/api",userRoutes);
app.use('/docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument))
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
