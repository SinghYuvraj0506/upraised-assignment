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
exports.ensureGuest = exports.verifyJWT = void 0;
const asyncHandler_js_1 = __importDefault(require("../utils/asyncHandler.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
exports.verifyJWT = (0, asyncHandler_js_1.default)((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!accessToken) {
            throw new ApiError_js_1.default(401, "Unauthorized Access!!!");
        }
        const decodedInfo = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedInfo || (decodedInfo === null || decodedInfo === void 0 ? void 0 : decodedInfo.status) !== 1) {
            throw new ApiError_js_1.default(400, "Unauthorized Access!!!");
        }
        req.user = decodedInfo;
        next();
    }
    catch (error) {
        throw new ApiError_js_1.default(401, (error === null || error === void 0 ? void 0 : error.message) || "Unauthorized Access!!!");
    }
}));
exports.ensureGuest = (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    try {
        if (accessToken) {
            const data = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if (data) {
                return res.redirect(process.env.CLIENT_URL);
            }
        }
        return next();
    }
    catch (error) {
        return next();
    }
}));
