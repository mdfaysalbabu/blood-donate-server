import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtToken } from "../../constants/jwtToken";
import prisma from "../../shared/prisma";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const token = jwtToken.generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
    name: string;
    email: string;
  };

  return {
    token,
    decodedToken,
  };
};

export const AuthServices = {
  loginUser,
};
