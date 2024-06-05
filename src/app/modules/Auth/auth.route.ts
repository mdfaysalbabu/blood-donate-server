import express from "express";
import { UserRole } from "../../../../prisma/generated/client";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.donor, UserRole.requester),
  AuthController.changePassword
);

export const AuthRoutes = router;
