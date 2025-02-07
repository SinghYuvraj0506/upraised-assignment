import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../config/db.config";
import ApiResponse from "../utils/ApiResponse";
import { z } from "zod";
import {
  createGadgetSchema,
  destructGadgetSchema,
  getGadgetSchema,
  updateGadgetSchema,
} from "../schemas/gadget.schema";
import ApiError from "../utils/ApiError";
import { gadgetNames } from "../utils/constants";

const getAllInclude = () => {
  return {
    id: true,
    name: true,
    success_probability: true,
    status: true,
    decommissioned_at: true,
    user_id: true,
  };
};

export const getAllgadgets = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      query: { status },
    }: z.infer<typeof getGadgetSchema> = req;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const gadgets = await prisma.gadget.findMany({
      where: {
        user_id: req.user?.id,
        ...where,
      },
      select: getAllInclude(),
    });

    res.json(new ApiResponse(200, gadgets, "Fetched all gadgets"));
  }
);


export const createGadgets = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      body: { name, success_probability },
    }: z.infer<typeof createGadgetSchema> = req;

    let uniqueName = name;

    if (!name) {
      let availableNames = [...gadgetNames];

      while (availableNames.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const randomName = availableNames[randomIndex];

        const existingGadget = await prisma.gadget.findUnique({
          where: { name: randomName },
        });

        if (!existingGadget) {
          uniqueName = randomName;
          break;
        }

        availableNames.splice(randomIndex, 1);
      }

      // If all names are taken, generate a fallback name
      if (!uniqueName) {
        do {
          uniqueName = `Gadget-${Math.random().toString(36).substring(2, 8)}`;
        } while (
          await prisma.gadget.findUnique({
            where: { name: uniqueName },
          })
        );
      }
    } else {
      const existingGadget = await prisma.gadget.findUnique({
        where: { name },
      });

      if (existingGadget) {
        throw new ApiError(400, "Gadget name must be unique");
      }
    }

    const gadget = await prisma.gadget.create({
      data: {
        name: uniqueName ?? "",
        success_probability,
        user_id: req.user?.id as string,
      },
      select: getAllInclude(),
    });

    res.json(new ApiResponse(200, gadget, "Created Gadget Successfully"));
  }
);


export const updateGadgets = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const {
      body: { name, success_probability },
    }: z.infer<typeof updateGadgetSchema> = req;

    const gadget = await prisma.gadget.update({
      where: {
        id: id,
        user_id: req.user?.id as string,
      },
      data: {
        name,
        success_probability,
      },
      select: getAllInclude(),
    });

    res.json(new ApiResponse(200, gadget, "Update gadget successfully"));
  }
);

export const deleteGadget = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const gadget = await prisma.gadget.findUnique({
      where: {
        id,
        user_id: req.user?.id as string,
      },
    });

    if (!gadget) {
      throw new ApiError(404, "Gadget not found");
    }

    await prisma.gadget.update({
      where: {
        id: id,
      },
      data: {
        status: "DECOMMISSIONED",
        decommissioned_at: new Date(),
      },
    });

    res.json(
      new ApiResponse(200, { success: true }, "Gadget deleted Successfully")
    );
  }
);

export const destructGadget = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    //@ts-ignore
    const {body: { code }}: z.infer<typeof destructGadgetSchema> = req

    const gadget = await prisma.gadget.findUnique({
      where: {
        id,
        user_id: req.user?.id as string,
      },
      include: {
        user: true,
      },
    });

    if (!gadget) {
      throw new ApiError(404, "Gadget not found");
    }

    if(!gadget.user.gadget_destruction_code || gadget.user?.gadget_destruction_code !== code){
      throw new ApiError(404, "Invalid Code");
    }

    await prisma.gadget.update({
      where: {
        id: id,
      },
      data: {
        status: "DESTROYED"
      },
    });

    res.json(
      new ApiResponse(200, { success: true }, "Gadget destructed Successfully")
    );
  }
);
