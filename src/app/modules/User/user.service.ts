import bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import {
  Prisma,
  RequestStatus,
  Status,
  UserProfile,
  UserRole,
} from "../../../../prisma/generated/client";
import config from "../../../config";
import { jwtToken } from "../../constants/jwtToken";
import { pagination } from "../../constants/pagination";
import ApiError from "../../errors/ApiError";
import { TPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";
import { searchableFields } from "./user.constant";

const registerUserIntoDB = async (req: Request): Promise<any> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    bloodType: req.body.bloodType,
    location: req.body.location,
  };

  const userProfileData = {
    bio: req.body.bio,
    age: req.body.age,
    lastDonationDate: req.body.lastDonationDate,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });
    await transactionClient.userProfile.create({
      data: {
        ...userProfileData,
        userId: user.id,
      },
    });

    const userWithProfile = await transactionClient.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        role: true,
        bloodType: true,
        location: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        userProfile: true,
      },
    });

    return userWithProfile;
  });
  return result;
};

const getAllDonarFromDB = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    AND: {
      role: {
        equals: UserRole.donor,
      },
    },
  });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  console.log(sortBy, sortOrder);
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      role: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getSingleDonarFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const createDonationRequestIntoDB = async (req: Request): Promise<any> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
  }

  // Decoding the token to get the requester's details
  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
    name: string;
    email: string;
  };
  const requestData = {
    ...req.body,
    requesterId: decodedToken.id,
  };
  console.log(requestData);
  const result = await prisma.request.create({
    data: requestData,
    select: {
      id: true,
      donorId: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          role: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
          userProfile: true,
        },
      },
    },
  });

  return result;
};

const getDonationRequestsForDonorFromDB = async (
  req: Request
): Promise<any> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
  }

  // Decoding the token to get the donor's details
  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
  };

  const result = await prisma.request.findMany({
    where: {
      donorId: decodedToken.id,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      },
    },
  });

  return result;
};

const updateRequestStatusIntoDB = async (
  req: Request,
  requestId: string,
  status: RequestStatus
): Promise<any> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
  }

  // Decoding the token to get the donor's details
  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
  };

  const request = await prisma.request.findUnique({
    where: {
      id: requestId,
    },
    select: {
      donorId: true,
    },
  });

  if (!request || request.donorId !== decodedToken.id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this request status!"
    );
  }

  // Updating the request status
  const updatedRequest = await prisma.request.update({
    where: {
      id: requestId,
    },
    data: {
      requestStatus: status,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedRequest;
};

const getUserProfileFromDB = async (req: Request): Promise<any> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
  }

  // Decoding the token to get the donor's details
  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
  };

  const result = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return result;
};

const updateUserProfileIntoDB = async (
  req: Request,
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
  }

  // Decoding the token to get the user's details
  const decodedToken = jwtToken.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as {
    id: string;
  };

  // Update user profile in the database based on the decoded user ID
  const updatedProfile = await prisma.userProfile.update({
    where: {
      userId: decodedToken.id,
    },
    data,
  });

  return updatedProfile;
};

type UpdateUser = {
  id: string;
  status?: Status;
  role?: UserRole;
};

const updateUserRoleStatusIntoDB = async (payload: UpdateUser) => {
  const updateData: Partial<UpdateUser> = {};

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (payload.role !== undefined) {
    updateData.role = payload.role;
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: updateData,
  });

  return updatedProfile;
};

export const UserService = {
  registerUserIntoDB,
  getAllDonarFromDB,
  createDonationRequestIntoDB,
  getDonationRequestsForDonorFromDB,
  updateRequestStatusIntoDB,
  getUserProfileFromDB,
  updateUserProfileIntoDB,
  getSingleDonarFromDB,
  updateUserRoleStatusIntoDB,
};
