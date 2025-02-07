import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - provider
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated UUID of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The unique email address of the user
 *         password:
 *           type: string
 *           nullable: true
 *           description: The hashed password of the user (nullable for OAuth users)
 *         name:
 *           type: string
 *           description: The full name of the user
 *         image:
 *           type: string
 *           nullable: true
 *           description: The profile image URL of the user
 *         provider:
 *           type: string
 *           enum: [GOOGLE, CREDENTIALS]
 *           description: The authentication provider used by the user
 *         refreshToken:
 *           type: string
 *           nullable: true
 *           description: The refresh token for the user (if applicable)
 *         status:
 *           type: integer
 *           default: 1
 *           description: The status of the user (e.g., 1 for active)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         email: "johndoe@example.com"
 *         password: null
 *         name: "John Doe"
 *         image: "https://example.com/avatar.jpg"
 *         provider: "GOOGLE"
 *         refreshToken: "some-refresh-token"
 *         status: 1
 *         created_at: "2024-02-07T12:00:00.000Z"
 *         updated_at: "2024-02-07T12:30:00.000Z"
 */

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password is weak, min 6 characters required"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password is weak, min 6 characters required"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().url("Invalid Image Url").optional(),
    gadget_destruction_code: z
      .number()
      .min(1000, "Code should of 4 digits")
      .max(9999, "Code should of 4 digits")
      .optional(),
  }),
});
