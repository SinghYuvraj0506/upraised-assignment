"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [process.env.CLIENT_URL],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/healthcheck", (req, res) => {
    res.send("Hello guys welcome to backend server");
});
// routes -------------------
app.use("/api/v1", (0, routes_1.default)());
(0, swagger_1.default)(app, process.env.PORT || 5000);
// 404 route handler
app.all("*", (req, res) => {
    throw new ApiError_1.default(404, `Route ${req.originalUrl} Not Found!!!`);
});
// handle Error Responses ---
app.use(error_middleware_1.default);
exports.default = app;
