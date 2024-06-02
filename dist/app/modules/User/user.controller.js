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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.registerUserIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: result,
    });
}));
const getAllDoner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.sortBy === "age") {
        req.query.sortBy = "userProfile";
        req.query.sortOrder = {
            age: req.query.sortOrder,
        };
    }
    else if (req.query.sortBy === "lastDonationDate") {
        req.query.sortBy = "userProfile";
        req.query.sortOrder = {
            lastDonationDate: req.query.sortOrder,
        };
    }
    if (req.query.availability === "true") {
        req.query.availability = true;
    }
    else if (req.query.availability === "false") {
        req.query.availability = false;
    }
    const filters = (0, pick_1.default)(req.query, user_constant_1.filterableFields);
    console.log(filters);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield user_service_1.UserService.getAllDonarFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Donors successfully found",
        meta: result.meta,
        data: result.data,
    });
}));
const createDonationRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createDonationRequestIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Request successfully made",
        data: result,
    });
}));
const getDonationRequestsForDonor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getDonationRequestsForDonorFromDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Donation requests retrieved successfully",
        data: result,
    });
}));
const updateRequestStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    const { status } = req.body;
    const result = yield user_service_1.UserService.updateRequestStatusIntoDB(req, requestId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Donation request status successfully updated",
        data: result,
    });
}));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getUserProfileFromDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: result,
    });
}));
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bio, age, lastDonationDate } = req.body;
    // Call the service to update the user profile
    const result = yield user_service_1.UserService.updateUserProfileIntoDB(req, {
        bio,
        age,
        lastDonationDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
}));
exports.UserController = {
    registerUser,
    getAllDoner,
    createDonationRequest,
    getDonationRequestsForDonor,
    updateRequestStatus,
    getUserProfile,
    updateUserProfile,
};
