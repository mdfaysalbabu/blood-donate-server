"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("../../../../prisma/generated/client");
const registerUserSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name field is required." }),
    email: zod_1.z
        .string({ required_error: "Email must be a valid email address." })
        .email(),
    phone: zod_1.z.string({ required_error: "Phone must be a valid phone no" }),
    role: zod_1.z
        .enum([client_1.UserRole.admin, client_1.UserRole.donor, client_1.UserRole.requester])
        .default("donor"),
    status: zod_1.z.enum([client_1.Status.active, client_1.Status.deactive]).default("active"),
    password: zod_1.z.string({ required_error: "Password must be included!" }),
    bloodType: zod_1.z.string({ required_error: "Blood type is required!" }),
    isDonateBlood: zod_1.z.boolean().default(true),
    location: zod_1.z.string({ required_error: "Location is required!" }),
    age: zod_1.z.number({ required_error: "Age must be at least 1!" }).int(),
    bio: zod_1.z.string({ required_error: "Bio is required!" }),
    lastDonationDate: zod_1.z.string({
        required_error: "Last donation date is required!",
    }),
});
const donationRequestSchema = zod_1.z.object({
    donorId: zod_1.z.string({ required_error: "Donor ID is required." }),
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
    lastDonationDate: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1, "Please enter your address!").optional(),
});
const updateUserRoleStatusSchema = zod_1.z.object({
    status: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
});
exports.UserValidation = {
    registerUserSchema,
    donationRequestSchema,
    updateRequestStatusSchema,
    updateUserProfileSchema,
    updateUserRoleStatusSchema,
};
