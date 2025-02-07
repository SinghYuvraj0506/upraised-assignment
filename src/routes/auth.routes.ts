import { Router } from "express";
import { ensureGuest, verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema, updateUserSchema } from "../schemas/auth.schema";
import { authGoogle, getUserData, googleCallback, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserInfo } from "../controllers/auth.controller";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 *
 * /api/v1/auth/google:
 *   get:
 *     summary: Initiates Google OAuth login
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login page
 *
 * /api/v1/auth/google/callback:
 *   post:
 *     summary: Handles Google OAuth callback
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *       401:
 *         description: Unauthorized or invalid credentials
 *
 * /api/v1/auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *
 * /api/v1/auth/me:
 *   get:
 *     summary: Fetches the authenticated user's data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logs out the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/auth/refresh:
 *   get:
 *     summary: Refreshes the access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token invalid or expired
 *       500:
 *         description: Internal server error
 * 
 * /api/v1/auth/update:
 *   put:
 *     summary: Update user's info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Returns updated user data along with a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UpdateUser'
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *         name:
 *           type: string
 *           description: The user's name
 *
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 * 
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         image:
 *           type: string
 *           format: url
 *           description: The user's image
 *         gadget_destruction_code:
 *           type: number
 *           description: gadget destrucution code
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The user's unique ID
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         name:
 *           type: string
 *           description: The user's full name
 *         image:
 *           type: string
 *           nullable: true
 *           description: The user's profile image URL
 *         provider:
 *           type: string
 *           enum: [GOOGLE, CREDENTIALS]
 *           description: The authentication provider
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The account creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 *
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */



const authRouter = (router:Router) => {
    router.get('/auth/google',ensureGuest,authGoogle);
    router.post('/auth/google/callback',ensureGuest,googleCallback);

    router.post('/auth/register',ensureGuest,validate(registerUserSchema),registerUser);
    router.post('/auth/login',ensureGuest,validate(loginUserSchema),loginUser);

    router.get('/auth/me',verifyJWT,getUserData);
    router.get('/auth/logout',verifyJWT,logoutUser);

    router.get('/auth/refresh',refreshAccessToken);
    router.put('/auth/update',verifyJWT,validate(updateUserSchema), updateUserInfo);
}

export default authRouter;
