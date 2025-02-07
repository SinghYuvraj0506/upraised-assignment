"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_schema_1 = require("../schemas/auth.schema");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (router) => {
    router.get('/auth/google', auth_middleware_1.ensureGuest, auth_controller_1.authGoogle);
    router.post('/auth/google/callback', auth_middleware_1.ensureGuest, auth_controller_1.googleCallback);
    router.post('/auth/register', auth_middleware_1.ensureGuest, (0, validate_middleware_1.default)(auth_schema_1.registerUserSchema), auth_controller_1.registerUser);
    router.post('/auth/login', auth_middleware_1.ensureGuest, (0, validate_middleware_1.default)(auth_schema_1.loginUserSchema), auth_controller_1.loginUser);
    router.get('/auth/me', auth_middleware_1.verifyJWT, auth_controller_1.getUserData);
    router.get('/auth/logout', auth_middleware_1.verifyJWT, auth_controller_1.logoutUser);
    router.get('/auth/refresh', auth_controller_1.refreshAccessToken);
};
exports.default = authRouter;
