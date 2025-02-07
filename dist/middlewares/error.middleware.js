"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    err.message = err.message || "Internal Server Error";
    return res.status(err === null || err === void 0 ? void 0 : err.statusCode).json({
        success: false,
        message: err.message
    });
};
exports.default = ErrorMiddleware;
