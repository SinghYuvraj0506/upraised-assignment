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
exports.updateUserInfo = exports.refreshAccessToken = exports.logoutUser = exports.getUserData = exports.loginUser = exports.registerUser = exports.googleCallback = exports.authGoogle = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const db_config_1 = __importDefault(require("../config/db.config"));
const jwt_1 = require("../utils/jwt");
const constants_1 = require("../utils/constants");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const googleapis_1 = require("googleapis");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleOAuthClient = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const getAllInclude = () => {
    return {
        "id": true,
        "email": true,
        "name": true,
        "image": true,
        "provider": true,
        "status": true,
        "created_at": true,
        "updated_at": true,
        "gadget_destruction_code": true
    };
};
// Google auth ------------------------
exports.authGoogle = (0, asyncHandler_1.default)((req, res) => {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const authorizationUrl = googleOAuthClient.generateAuthUrl({
        access_type: "online",
        scope: scopes,
    });
    res.json(new ApiResponse_1.default(200, { redirectTo: authorizationUrl }, "Fetched Redirection URL"));
});
exports.googleCallback = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        if (!code) {
            throw new ApiError_1.default(401, "Code not found, Some Error Occured");
        }
        let { tokens } = yield googleOAuthClient.getToken(code);
        const { data: profile } = yield axios_1.default.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (!profile) {
            throw new ApiError_1.default(400, "Error in Google Login");
        }
        const user = yield db_config_1.default.user.upsert({
            where: { email: profile === null || profile === void 0 ? void 0 : profile.email },
            create: {
                email: profile === null || profile === void 0 ? void 0 : profile.email,
                name: profile === null || profile === void 0 ? void 0 : profile.name,
                image: profile === null || profile === void 0 ? void 0 : profile.picture,
                provider: "GOOGLE",
            },
            update: {
                name: profile === null || profile === void 0 ? void 0 : profile.name,
                image: profile === null || profile === void 0 ? void 0 : profile.picture,
            },
        });
        const { accessToken, refreshToken } = yield (0, jwt_1.generateAccessAndRefreshTokens)({
            id: user === null || user === void 0 ? void 0 : user.id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            status: user === null || user === void 0 ? void 0 : user.status,
        });
        if (!accessToken || !refreshToken) {
            throw new ApiError_1.default(400, "Error in Google Login");
        }
        res
            .status(200)
            .cookie("accessToken", accessToken, constants_1.cookieOption)
            .cookie("refreshToken", refreshToken, constants_1.cookieOption)
            .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
    }
    catch (error) {
        console.log(error);
        res.redirect(`${process.env.ClIENT_URL}`);
    }
}));
// credentials auth --------------------------------------------------
exports.registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { name, email, password }, } = req;
    let user = yield db_config_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (user) {
        throw new ApiError_1.default(400, "Email is already registerd");
    }
    const newPassword = yield (0, jwt_1.hashPassword)(password);
    if (!newPassword) {
        throw new ApiError_1.default(400, "Some error occurred");
    }
    user = yield db_config_1.default.user.create({
        data: {
            name,
            email,
            password: newPassword,
            provider: "CREDENTIALS",
        },
    });
    const { accessToken, refreshToken } = yield (0, jwt_1.generateAccessAndRefreshTokens)({
        id: user === null || user === void 0 ? void 0 : user.id,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        status: user === null || user === void 0 ? void 0 : user.status,
    });
    if (!accessToken || !refreshToken) {
        throw new ApiError_1.default(400, "Error in Credentials Signup");
    }
    // res
    //   .status(200)
    // .cookie("accessToken", accessToken, cookieOption)
    // .cookie("refreshToken", refreshToken, cookieOption)
    // .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
    res.status(200).json(new ApiResponse_1.default(200, {
        accessToken,
        refreshToken,
    }, "User Registered Successfully"));
}));
exports.loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, password }, } = req;
    let user = yield db_config_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user || !(user === null || user === void 0 ? void 0 : user.password)) {
        throw new ApiError_1.default(400, "Invalid Credentials");
    }
    const checkPassword = yield (0, jwt_1.comparePassword)(user.password, password);
    if (!checkPassword) {
        throw new ApiError_1.default(400, "Invalid Credentials");
    }
    //  setting jwt in cookie ------------
    const { accessToken, refreshToken } = yield (0, jwt_1.generateAccessAndRefreshTokens)({
        id: user === null || user === void 0 ? void 0 : user.id,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        status: user === null || user === void 0 ? void 0 : user.status,
    });
    if (!accessToken || !refreshToken) {
        throw new ApiError_1.default(400, "Error in Credentials Login");
    }
    // return res
    //   .status(200)
    //   .cookie("accessToken", accessToken, cookieOption)
    //   .cookie("refreshToken", refreshToken, cookieOption)
    //   .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
    res.status(200).json(new ApiResponse_1.default(200, {
        accessToken,
        refreshToken,
    }, "User Logined Successfully"));
}));
exports.getUserData = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const user = yield db_config_1.default.user.findUnique({
        where: {
            id: userData === null || userData === void 0 ? void 0 : userData.id,
        },
        select: getAllInclude()
    });
    if (!user || (user === null || user === void 0 ? void 0 : user.status) !== 1) {
        throw new ApiError_1.default(400, "Some Error Occured, logout and try again");
    }
    res.json(new ApiResponse_1.default(200, Object.assign({}, user), "User fetched successfully"));
}));
// user logout --------------------------
exports.logoutUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield db_config_1.default.user.update({
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        data: {
            refreshToken: null,
        },
    });
    return res
        .status(200)
        .clearCookie("accessToken", constants_1.cookieOption)
        .clearCookie("refreshToken", constants_1.cookieOption)
        .redirect(process.env.CLIENT_URL);
}));
// refresh user token --------------------------
exports.refreshAccessToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError_1.default(401, "Unauthorized request!!!");
        }
        const decodedInfo = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedInfo || (decodedInfo === null || decodedInfo === void 0 ? void 0 : decodedInfo.status) !== 1) {
            throw new ApiError_1.default(400, "Unauthorized Access!!!");
        }
        let user = yield db_config_1.default.user.findUnique(decodedInfo === null || decodedInfo === void 0 ? void 0 : decodedInfo.id);
        if (!user || user.status !== 1) {
            throw new ApiError_1.default(401, "Unauthorized Access!!!");
        }
        if (incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
            throw new ApiError_1.default(401, "Invalid/Expired Session");
        }
        const { accessToken, refreshToken } = yield (0, jwt_1.generateAccessAndRefreshTokens)({
            id: user === null || user === void 0 ? void 0 : user.id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            status: user === null || user === void 0 ? void 0 : user.status,
        });
        // res
        //   .status(200)
        //   .cookie("accessToken", accessToken, cookieOption)
        //   .cookie("refreshToken", refreshToken, cookieOption)
        //   .json(new ApiResponse(200, {}, "Access Token Refreshed"));
        res.status(200).json(new ApiResponse_1.default(200, {
            accessToken,
            refreshToken,
        }, "Access Token Refreshed"));
    }
    catch (error) {
        throw new ApiError_1.default(401, (error === null || error === void 0 ? void 0 : error.message) || "Error in Refreshing Token");
    }
}));
exports.updateUserInfo = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { body: { name, image, gadget_destruction_code }, } = req;
        const user = yield db_config_1.default.user.update({
            where: { id: userId },
            data: {
                name,
                image,
                gadget_destruction_code
            },
            select: getAllInclude()
        });
        res
            .status(200)
            .json(new ApiResponse_1.default(200, user, "User updated successfully"));
    }
    catch (error) {
        throw new ApiError_1.default(401, (error === null || error === void 0 ? void 0 : error.message) || "Error in updating user");
    }
}));
