import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./config/database.js";
import { ApiError } from "./utils/apiError.js";
import { globalErrorHandlingMiddleWare } from "./middlewares/errorMiddleWare.js";
import { app , server} from "./utils/socket.js";

app.use(express.json({ limit: '50mb' })); // Increase the limit to 50MB or as needed
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow multiple origins
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

dotenv.config()

//middlewares 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoute);

app.use("*", (req, res , next) => {
    const err = new ApiError(`cannot find this route :${req.originalUrl}` , 400);
    next(err);
})
//global error handling middleware 
app.use(globalErrorHandlingMiddleWare)
//handling errors outside express js 
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled rejection Error :${err.name} | ${err.message}`);
    server.close(() => {
      console.error("shutting down ..........");
      process.exit(1);
    });
  });
//server starting , and the db connection 
const port = process.env.PORT;
await dbConnection()
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

