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
exports.destructGadget = exports.deleteGadget = exports.updateGadgets = exports.createGadgets = exports.getAllgadgets = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const db_config_1 = __importDefault(require("../config/db.config"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getAllInclude = () => {
    return {
        id: true,
        name: true,
        success_probability: true,
        status: true,
        decommissioned_at: true,
        user_id: true,
    };
};
exports.getAllgadgets = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { query: { status }, } = req;
    const where = {};
    if (status) {
        where.status = status;
    }
    const gadgets = yield db_config_1.default.gadget.findMany({
        where: Object.assign({ user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, where),
        select: getAllInclude(),
    });
    res.json(new ApiResponse_1.default(200, gadgets, "Fetched all gadgets"));
}));
exports.createGadgets = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { body: { name, success_probability }, } = req;
    const gadget = yield db_config_1.default.gadget.create({
        data: {
            name: name !== null && name !== void 0 ? name : "s",
            success_probability: success_probability,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
        select: getAllInclude(),
    });
    res.json(new ApiResponse_1.default(200, gadget, "Created Gadget Successfully"));
}));
exports.updateGadgets = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const { body: { name, success_probability }, } = req;
    const gadget = yield db_config_1.default.gadget.update({
        where: {
            id: id,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
        data: {
            name,
            success_probability,
        },
        select: getAllInclude(),
    });
    res.json(new ApiResponse_1.default(200, gadget, "Update gadget successfully"));
}));
exports.deleteGadget = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const gadget = yield db_config_1.default.gadget.findUnique({
        where: {
            id,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    if (!gadget) {
        throw new ApiError_1.default(404, "Gadget not found");
    }
    yield db_config_1.default.gadget.update({
        where: {
            id: id,
        },
        data: {
            status: "DECOMMISSIONED",
            decommissioned_at: new Date(),
        },
    });
    res.json(new ApiResponse_1.default(200, { success: true }, "Gadget deleted Successfully"));
}));
exports.destructGadget = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = req.params.id;
    //@ts-ignore
    const { body: { code } } = req;
    const gadget = yield db_config_1.default.gadget.findUnique({
        where: {
            id,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
        include: {
            user: true,
        },
    });
    if (!gadget) {
        throw new ApiError_1.default(404, "Gadget not found");
    }
    if (!gadget.user.gadget_destruction_code || ((_b = gadget.user) === null || _b === void 0 ? void 0 : _b.gadget_destruction_code) !== code) {
        throw new ApiError_1.default(404, "Invalid Code");
    }
    yield db_config_1.default.gadget.update({
        where: {
            id: id,
        },
        data: {
            status: "DESTROYED"
        },
    });
    res.json(new ApiResponse_1.default(200, { success: true }, "Gadget destructed Successfully"));
}));
