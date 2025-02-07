import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import ErrorMiddleware from "./middlewares/error.middleware";
import ApiError from "./utils/ApiError"
import router from "./routes";
import swaggerDocs from "./utils/swagger";

const app = express();

const corsOptions = {
  origin: [process.env.CLIENT_URL as string],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/healthcheck", (req, res) => {
  res.send("Hello guys welcome to backend server");
});

// routes -------------------
app.use("/api/v1", router());

swaggerDocs(app, process.env.PORT as any || 5000);

// 404 route handler
app.all("*", (req: Request, res: Response) => {
  throw new ApiError(404, `Route ${req.originalUrl} Not Found!!!`);
});

// handle Error Responses ---
app.use(ErrorMiddleware as any)

export default app;
