"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }).email("Invalid Email"),
        password: zod_1.z.string({ required_error: "Password is required" }).min(6, 'Password is weak, min 6 characters required'),
    })
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email("Invalid Email"),
        password: zod_1.z.string({ required_error: "Password is required" }).min(6, 'Password is weak, min 6 characters required'),
    })
});
