"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.generateAccessAndRefreshTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = __importDefault(require("./ApiError"));
const db_config_1 = __importDefault(require("../config/db.config"));
const generateAccessAndRefreshTokens = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
            throw new Error("Invalid Request");
        }
        yield db_config_1.default.user.update({
            where: { email: payload === null || payload === void 0 ? void 0 : payload.email },
            data: {
                refreshToken
            }
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(500, "Something went wrong in authorization");
    }
});
exports.generateAccessAndRefreshTokens = generateAccessAndRefreshTokens;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        return hashedPassword;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(500, "Error in hashing password");
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (hash, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bool = yield bcryptjs_1.default.compare(password, hash);
        return bool;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(500, "Error in comparing password");
    }
});
exports.comparePassword = comparePassword;
