import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../utils/validateEnv";
import logger from "../config/logger";
import mailSvc from "../utils/mail";
import { Org } from "../models/Org.model";
import { CustomRequest } from "../middleware/auth.middleware";

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const { email, password, role, orgId } = req.body;

      if (!email || !password) {
        throw new ErrorHandler("Please provide email and password", 400);
      }

      const validRoles = ["parent", "student", "admin"];
      if (!validRoles.includes(role)) {
        throw new ErrorHandler("Invalid role provided", 400);
      }

      const userRepo = getRepository(User);
      const orgRepo = getRepository(Org);

      let org: Org | null = null;
      if (role !== "admin") {
        if (!orgId) {
          throw new ErrorHandler(
            "Organization ID is required for non-admin roles",
            400
          );
        }
        org = await orgRepo.findOne({
          where: { id: orgId },
        });
        if (!org) {
          throw new ErrorHandler("Organization not found", 404);
        }
      }

      const user = await userRepo.findOne({
        where: { email },
      });
      if (user) {
        throw new ErrorHandler("User already exists", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = userRepo.create({
        email,
        password: hashedPassword,
        role,
        org: org || undefined,
      });

      await userRepo.save(newUser);
      const accessToken = jwt.sign(
        { id: newUser.id, role: newUser.role },
        env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        { id: newUser.id, role: newUser.role },
        env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      newUser.refreshToken = refreshToken;
      newUser.refreshTokenExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );

      await userRepo.save(newUser);
      res.status(201).json({
        success: true,
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          org: org ? org.id : null,
        },
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error registering user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ErrorHandler("Please provide email and password", 400);
      }

      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: { email },
        relations: ["org"],
      });

      if (!user) {
        throw new ErrorHandler("Invalid credentials", 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ErrorHandler("Invalid credentials", 401);
      }

      const accessToken = jwt.sign(
        { id: user.id, role: user.role, orgId: user.org?.id },
        env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id, role: user.role, orgId: user.org?.id },
        env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      user.refreshToken = refreshToken;
      user.refreshTokenExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );

      await userRepo.save(user);
      res.status(200).json({
        success: true,
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          org: user?.org?.id,
        },
      });
    } catch (error: any) {
      console.log(error);

      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error registering user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ErrorHandler("Please provide email", 400);
      }
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: { email },
      });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const url = `${env.CLIENT_URL}/reset-password/${token}`;
      const body = `Click this link to reset your password: ${url}`;
      console.log(body);

      await mailSvc.sendMail(email, "Reset Your Password", body);
      res.status(200).json({
        message: "Password reset email sent successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting user by id: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        throw new ErrorHandler("Token and password are required", 400);
      }
      let decoded: JwtPayload;
      if (typeof token === "string") {
        decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      } else {
        throw new ErrorHandler("Invalid token format", 400);
      }
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ where: { id: decoded.id } });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await userRepository.save(user);
      res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error resetting password: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  addUsername = async (req: CustomRequest, res: Response) => {
    try {
      const { name } = req.body;
      const userRepo = getRepository(User);

      // Check if the username is already taken
      const existingUser = await userRepo.findOne({ where: { name } });
      if (existingUser) {
        throw new ErrorHandler("Username is already taken", 400);
      }

      // Fetch the user by id
      const user = await userRepo.findOne({ where: { id: req.user.id } });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }

      // Update the username and save
      user.name = name;
      await userRepo.save(user);

      res.status(200).json({
        message: "Username added successfully",
        user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error adding username: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
