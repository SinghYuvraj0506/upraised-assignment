"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = (schema) => (req, res, next) => {
    var _a;
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        throw new ApiError_1.default(400, (_a = e === null || e === void 0 ? void 0 : e.errors[0]) === null || _a === void 0 ? void 0 : _a.message);
    }
};
exports.default = validate;
