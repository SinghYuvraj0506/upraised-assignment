"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(statusCode, data, message = "Success Request") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
exports.default = ApiResponse;
