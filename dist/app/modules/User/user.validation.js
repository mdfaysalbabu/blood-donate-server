"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const registerUserSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name field is required." }),
    email: zod_1.z
        .string({ required_error: "Email must be a valid email address." })
        .email(),
    password: zod_1.z.string({ required_error: "Password must be included!" }),
    bloodType: zod_1.z.string({ required_error: "Blood type is required!" }),
    location: zod_1.z.string({ required_error: "Location is required!" }),
    age: zod_1.z.number({ required_error: "Age must be at least 1!" }).int(),
    bio: zod_1.z.string({ required_error: "Bio is required!" }),
    lastDonationDate: zod_1.z.string({
        required_error: "Last donation date is required!",
    }),
});
const donationRequestSchema = zod_1.z.object({
    donorId: zod_1.z.string({ required_error: "Donor ID is required." }),
    phoneNumber: zod_1.z.string({ required_error: "Phone number is required." }),
    dateOfDonation: zod_1.z.string({
        required_error: "Date of donation is required and must be in the format YYYY-MM-DD.",
    }),
    hospitalName: zod_1.z.string({ required_error: "Hospital name is required." }),
    hospitalAddress: zod_1.z.string({
        required_error: "Hospital address is required.",
    }),
    reason: zod_1.z.string({ required_error: "Reason for asking is required." }),
});
const updateRequestStatusSchema = zod_1.z.object({
    status: zod_1.z.string({ required_error: "Status is required." }),
});
const updateUserProfileSchema = zod_1.z.object({
    bio: zod_1.z.string().optional(),
    age: zod_1.z.number().optional(),
    lastDonationDate: zod_1.z.date().optional(),
});
exports.UserValidation = {
    registerUserSchema,
    donationRequestSchema,
    updateRequestStatusSchema,
    updateUserProfileSchema,
};
