import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import logger from "../config/logger";
import { Org } from "../models/Org.model";
import cloudinary from "../config/cloudinary.config";
import { CustomRequest } from "../middleware/auth.middleware";
import { User } from "../models/User.model";

export class OrgController {
  createOrg = async (req: Request, res: Response) => {
    try {
      const { name, address, phone, email, website, details } = req.body;
      const orgRepository = getRepository(Org);

      // Check if organization already exists
      const existingOrg = await orgRepository.findOne({ where: { name } });
      if (existingOrg) {
        throw new ErrorHandler("Organization already exists", 400);
      }

      // Create new organization
      const newOrg = new Org();
      newOrg.name = name;
      newOrg.address = address;
      newOrg.phone = phone;
      newOrg.email = email;
      newOrg.website = website;
      newOrg.details = details;

      await orgRepository.save(newOrg);

      res.status(201).json({
        success: true,
        message: "Organization created successfully",
        org: newOrg,
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

  addLogo = async (req: Request, res: Response) => {
    try {
      const id = req.body.orgId;
      const orgRepository = getRepository(Org);
      const org = await orgRepository.findOne({ where: { id } });
      if (!org) {
        throw new ErrorHandler("Organization not found", 404);
      }
      let cloud;
      if (req.file?.path) {
        try {
          cloud = await cloudinary.v2.uploader.upload(req.file?.path);
          org.logo = cloud.secure_url;
          await orgRepository.save(org);
          res.status(200).json({
            success: true,
            message: "Logo added successfully",
            org,
          });
        } catch (error: any) {
          throw new ErrorHandler(error.message, 500);
        }
      }
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

  addMainPic = async (req: Request, res: Response) => {
    try {
      const id = req.body.orgId;
      const orgRepository = getRepository(Org);
      const org = await orgRepository.findOne({ where: { id } });
      if (!org) {
        throw new ErrorHandler("Organization not found", 404);
      }
      let cloud;
      if (req.file?.path) {
        try {
          cloud = await cloudinary.v2.uploader.upload(req.file?.path);
          org.mainPic = cloud.secure_url;
          await orgRepository.save(org);
          res.status(200).json({
            success: true,
            message: "Logo added successfully",
            org,
          });
        } catch (error: any) {
          throw new ErrorHandler(error.message, 500);
        }
      }
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

  addOtherPics = async (req: Request, res: Response) => {
    try {
      const id = req.body.orgId;
      const orgRepository = getRepository(Org);
      const org = await orgRepository.findOne({ where: { id } });
      console.log(req.files);

      if (!org) {
        throw new ErrorHandler("Organization not found", 404);
      }
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new ErrorHandler("No files uploaded", 400);
      }
      if (!org.otherPics) {
        org.otherPics = [];
      }
      let uploadedUrls: string[] = [];

      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.v2.uploader.upload(file.path);
        uploadedUrls.push(result.secure_url);
      }

      org.otherPics = [...org.otherPics, ...uploadedUrls];
      await orgRepository.save(org);

      res.status(200).json({
        success: true,
        message: "Images added successfully",
        org,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error adding image: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  addOrgsVideo = async (req: Request, res: Response) => {
    try {
      const id = req.body.orgId;
      const orgRepository = getRepository(Org);
      const org = await orgRepository.findOne({ where: { id } });
      if (!org) {
        throw new ErrorHandler("Organization not found", 404);
      }
      if (!req.file || !req.file.path) {
        throw new Error("No video file uploaded");
      }

      // Upload video to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "org_videos",
      });

      org.orgsVideo = result.secure_url;
      await orgRepository.save(org);

      res.status(200).json({
        success: true,
        message: "Video added successfully",
        org,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error adding video: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getAllOrgs = async (req: Request, res: Response) => {
    try {
      const orgRepository = getRepository(Org);
      const orgs = await orgRepository.find();
      res.status(200).json({
        success: true,
        message: "All organizations",
        orgs,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting all organizations: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getMyOrg = async (req: CustomRequest, res: Response) => {
    try {
      let userId = req.user.id;
      const userRepository = getRepository(User);
      const orgRepository = getRepository(Org);
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["org"],
      });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      if (!user.org) {
        throw new ErrorHandler("Organization not found", 404);
      }
      const org = await orgRepository.findOne({
        where: { id: user.org.id },
      });
      if (!org) {
        throw new ErrorHandler("Organization not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Organization",
        org,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting organization: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  // deleteOrg = async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     const orgRepository = getRepository(Org);
  //     const org = await orgRepository.findOne({ where: { id } });
  //     if (!org) {
  //       throw new ErrorHandler("Organization not found", 404);
  //     }
  //     await orgRepository.delete(id);
  //     res.status(200).json({
  //       success: true,
  //       message: "Organization deleted successfully",
  //     });
  //   } catch (error: any) {
  //     const statusCode = error.statusCode || 500;
  //     const message = error.message || "An error occurred";
  //     const err = new ErrorHandler(message, statusCode);
  //     logger.error(`Error deleting organization: ${message}`, error);
  //     res.status(statusCode).json({
  //       error: err.message,
  //       message: "An error occurred",
  //     });
  //   }
  // };
}
