import express from "express";
import { UserRole } from "../../../../prisma/generated/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/donor-list", UserController.getAllDoner);
router.get("/donor/:id", UserController.getSingleDoner);

router.get(
  "/donation-request",
  auth(UserRole.admin, UserRole.user),
  UserController.getDonationRequestsForDonor
);

router.get(
  "/my-profile",
  auth(UserRole.admin, UserRole.donor, UserRole.user),
  UserController.getUserProfile
);

router.put(
  "/my-profile",
  auth(UserRole.admin, UserRole.donor, UserRole.user),
  validateRequest(UserValidation.updateUserProfileSchema),
  UserController.updateUserProfile
);

router.post(
  "/register",
  validateRequest(UserValidation.registerUserSchema),
  UserController.registerUser
);

router.post(
  "/donation-request",
  auth(UserRole.user),
  validateRequest(UserValidation.donationRequestSchema),
  UserController.createDonationRequest
);

router.put(
  "/donation-request/:requestId",
  auth(UserRole.admin, UserRole.donor),
  validateRequest(UserValidation.updateRequestStatusSchema),
  UserController.updateRequestStatus
);

router.patch(
  "/manage-user",
  auth(UserRole.admin),
  validateRequest(UserValidation.updateUserRoleStatusSchema),
  UserController.updateUserRoleStatusIntoDB
);

export const UserRoutes = router;
