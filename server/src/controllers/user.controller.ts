import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    user.encryptPassword();

    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, user, "user created successfully..."));
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found...");
    }

    if (!(await user.isPasswordMatched(password))) {
      throw new ApiError(401, "Invalid password...");
    }

    // @ts-ignore
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRY!,
    });

    const { _id, firstName, lastName, ...rest } = user.toJSON();

    res
      .cookie("token", token, {
        path: "/",
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        // sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            _id,
            firstName,
            lastName,
            email,
          },
          "user loggedin successfully..."
        )
      );
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body.user;

    const user = await User.findById(userId).select(
      "_id firstName lastName email"
    );

    if (!user) {
      throw new ApiError(404, "User not found...");
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "user get successfully..."));
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .cookie("token", null, {
        path: "/",
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(new ApiResponse(200, null, "user logout successfully..."));
  }
);
