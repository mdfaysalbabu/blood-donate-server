import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/donor-list", UserController.getAllDoner);

router.get(
  "/donation-request",
  auth(),
  UserController.getDonationRequestsForDonor
);

router.get("/my-profile", auth(), UserController.getUserProfile);

router.put(
  "/my-profile",
  auth(),
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
  auth(),
  validateRequest(UserValidation.donationRequestSchema),
  UserController.createDonationRequest
);

router.put(
  "/donation-request/:requestId",
  auth(),
  validateRequest(UserValidation.updateRequestStatusSchema),
  UserController.updateRequestStatus
);

export const UserRoutes = router;
