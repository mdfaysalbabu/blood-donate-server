"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importStar(require("http-status"));
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
const globalErrorHandler = (error, req, res, next) => {
    // Handling Zod validation errors
    console.log(error);
    if (error instanceof zod_1.ZodError) {
        const issues = error.errors;
        const formattedErrors = issues.map((issue) => ({
            field: issue.path.join(""),
            message: issue.message,
        }));
        const errorMessage = formattedErrors
            .map((issue) => issue.message)
            .join(" ");
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: errorMessage,
            errorDetails: { issues: formattedErrors },
        });
    }
    // Handling unauthorized errors
    if (error instanceof jsonwebtoken_1.TokenExpiredError ||
        error instanceof jsonwebtoken_1.JsonWebTokenError ||
        error.statusCode === 401 // Check if error has status code 401
    ) {
        let errorMessage = "Unauthorized access";
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            errorMessage = "JWT token has expired.";
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            errorMessage = error.message;
        }
        else if (error.statusCode === 401) {
            errorMessage = error.message || "You are not authorized!";
        }
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: errorMessage,
            errorDetails: http_status_1.UNAUTHORIZED,
        });
    }
    // Handling other errors
    return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
        errorDetails: error,
    });
};
exports.default = globalErrorHandler;
