import { z } from "zod";

const registerUserSchema = z.object({
  name: z.string({ required_error: "Name field is required." }),
  email: z
    .string({ required_error: "Email must be a valid email address." })
    .email(),
  phone: z.string({ required_error: "Phone must be a valid phone no" }),
  password: z.string({ required_error: "Password must be included!" }),
  bloodType: z.string({ required_error: "Blood type is required!" }),
  location: z.string({ required_error: "Location is required!" }),
  age: z.number({ required_error: "Age must be at least 1!" }).int(),
  bio: z.string({ required_error: "Bio is required!" }),
  lastDonationDate: z.string({
    required_error: "Last donation date is required!",
  }),
});

const donationRequestSchema = z.object({
  donorId: z.string({ required_error: "Donor ID is required." }),
  dateOfDonation: z.string({
    required_error:
      "Date of donation is required and must be in the format YYYY-MM-DD.",
  }),
  hospitalName: z.string({ required_error: "Hospital name is required." }),
  hospitalAddress: z.string({
    required_error: "Hospital address is required.",
  }),
  reason: z.string({ required_error: "Reason for asking is required." }),
});

const updateRequestStatusSchema = z.object({
  status: z.string({ required_error: "Status is required." }),
});

const updateUserProfileSchema = z.object({
  bio: z.string().optional(),
  age: z.number().optional(),
  lastDonationDate: z.date().optional(),
});

const updateUserRoleStatusSchema = z.object({
  status: z.string().optional(),
  role: z.string().optional(),
});

export const UserValidation = {
  registerUserSchema,
  donationRequestSchema,
  updateRequestStatusSchema,
  updateUserProfileSchema,
  updateUserRoleStatusSchema,
};
