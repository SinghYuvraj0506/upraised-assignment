"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destructGadgetSchema = exports.deleteGadgetSchema = exports.updateGadgetSchema = exports.createGadgetSchema = exports.getGadgetSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
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
exports.getGadgetSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.GADGET_STATUS).optional(),
    }),
});
exports.createGadgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        success_probability: zod_1.z
            .number({ required_error: "Success Probability is required" })
            .max(100, "Max value should be 100")
            .min(0, "Min should be 0"),
    }),
});
exports.updateGadgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        success_probability: zod_1.z
            .number({ required_error: "Success Probability is required" })
            .max(100, "Max value should be 100")
            .min(0, "Min should be 0")
            .optional(),
    }),
});
exports.deleteGadgetSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: "id is required" }).uuid("Enter valid id"),
    }),
});
exports.destructGadgetSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: "id is required" }).uuid("Enter valid id"),
    }),
    body: zod_1.z.object({
        code: zod_1.z
            .number()
            .min(1000, "Code should of 4 digits")
            .max(9999, "Code should of 4 digits")
            .optional(),
    }),
});
