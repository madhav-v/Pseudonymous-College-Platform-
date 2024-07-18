import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Materials } from "../models/Material.model";
import ErrorHandler from "../utils/errorhandler";
import logger from "../config/logger";
import cloudinary from "../config/cloudinary.config";

export class MaterialController {
  createMaterial = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      const material = new Materials();
      material.title = title;
      material.description = description;

      const materialRepository = getRepository(Materials);

      if (req.file?.path) {
        let cloud;
        try {
          // Determine if the file is an image or a PDF
          const isImage = req.file.mimetype.startsWith("image/");
          const isPdf = req.file.mimetype === "application/pdf";

          if (isImage) {
            cloud = await cloudinary.v2.uploader.upload(req.file.path, {
              resource_type: "image",
            });
            material.file = cloud.secure_url;
          } else if (isPdf) {
            cloud = await cloudinary.v2.uploader.upload(req.file.path);
            material.file = cloud.secure_url;
          } else {
            throw new ErrorHandler("Unsupported file type", 400);
          }

          await materialRepository.save(material);
          res.status(201).json({
            success: true,
            message: "Material created successfully",
            material,
          });
        } catch (error: any) {
          throw new ErrorHandler(error.message, 500);
        }
      } else {
        await materialRepository.save(material);
        res.status(201).json({
          success: true,
          message: "Material created successfully",
          material,
        });
      }
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error creating material: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  updateMaterial = async (req: Request, res: Response) => {
    try {
      let { id } = req.params;
      let { title, description } = req.body;
      const materialRepository = getRepository(Materials);
      let material = await materialRepository.findOne({
        where: { id: Number(id) },
      });
      if (!material) {
        throw new ErrorHandler("Material not found", 404);
      }
      material.title = title ?? material.title;
      material.description = description ?? material.description;

      if (req.file?.path) {
        let cloud;
        try {
          // Determine if the file is an image or a PDF
          const isImage = req.file.mimetype.startsWith("image/");
          const isPdf = req.file.mimetype === "application/pdf";

          if (isImage) {
            cloud = await cloudinary.v2.uploader.upload(req.file.path, {
              resource_type: "image",
            });
            material.file = cloud.secure_url;
          } else if (isPdf) {
            cloud = await cloudinary.v2.uploader.upload(req.file.path, {
              resource_type: "raw",
            });
            material.file = cloud.secure_url;
          } else {
            throw new ErrorHandler("Unsupported file type", 400);
          }

          await materialRepository.save(material);
          res.status(200).json({
            success: true,
            message: "Material updated successfully",
            material,
          });
        } catch (error: any) {
          throw new ErrorHandler(error.message, 500);
        }
      } else {
        await materialRepository.save(material);
        res.status(200).json({
          success: true,
          message: "Material updated successfully",
          material,
        });
      }
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error updating material: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getAllMaterials = async (req: Request, res: Response) => {
    try {
      const materialRepository = getRepository(Materials);

      const materials = await materialRepository.find();

      res.status(200).json({
        success: true,
        materials,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching materials: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getMaterialById = async (req: Request, res: Response) => {
    try {
      const materialRepository = getRepository(Materials);

      const { id } = req.params;
      const material = await materialRepository.findOne({
        where: { id: Number(id) },
      });
      if (!material) {
        throw new ErrorHandler("Material not found", 404);
      }

      res.status(200).json({
        success: true,
        material,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching material: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  deleteMaterialById = async (req: Request, res: Response) => {
    try {
      const materialRepository = getRepository(Materials);

      const { id } = req.params;
      const material = await materialRepository.findOne({
        where: { id: Number(id) },
      });
      if (!material) {
        throw new ErrorHandler("Material not found", 404);
      }

      await materialRepository.remove(material);

      res.status(200).json({
        success: true,
        message: "Material deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error deleting material: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
