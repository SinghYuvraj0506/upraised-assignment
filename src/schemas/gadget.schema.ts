import { GADGET_STATUS } from "@prisma/client";
import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     Gadget:
 *       type: object
 *       required:
 *         - name
 *         - success_probability
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated UUID of the gadget
 *         name:
 *           type: string
 *           description: The unique name of the gadget
 *         success_probability:
 *           type: integer
 *           description: The success probability of the gadget in percentage
 *         status:
 *           type: string
 *           enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *           description: The current status of the gadget
 *         decommissioned_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The timestamp when the gadget was decommissioned (if applicable)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the gadget was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the gadget was last updated
 *       example:
 *         id: "d5fE_asz"
 *         name: "The Nightingale"
 *         success_probability: 87
 *         status: "AVAILABLE"
 *         decommissioned_at: null
 *         created_at: "2024-02-07T12:00:00.000Z"
 *         updated_at: "2024-02-07T12:30:00.000Z"
 */

export const getGadgetSchema = z.object({
  query: z.object({
    status: z.nativeEnum(GADGET_STATUS).optional(),
  }),
});

export const createGadgetSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    success_probability: z
      .number({ required_error: "Success Probability is required" })
      .max(100, "Max value should be 100")
      .min(0, "Min should be 0"),
  }),
});

export const updateGadgetSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    success_probability: z
      .number({ required_error: "Success Probability is required" })
      .max(100, "Max value should be 100")
      .min(0, "Min should be 0")
      .optional(),
  }),
});

export const deleteGadgetSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "id is required" }).uuid("Enter valid id"),
  }),
});

export const destructGadgetSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "id is required" }).uuid("Enter valid id"),
  }),
  body: z.object({
    code: z
      .number()
      .min(1000, "Code should of 4 digits")
      .max(9999, "Code should of 4 digits")
      .optional(),
  }),
});
