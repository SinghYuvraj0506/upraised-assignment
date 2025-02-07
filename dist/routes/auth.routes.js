"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_schema_1 = require("../schemas/auth.schema");
const auth_controller_1 = require("../controllers/auth.controller");
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
const authRouter = (router) => {
    router.get('/auth/google', auth_middleware_1.ensureGuest, auth_controller_1.authGoogle);
    router.post('/auth/google/callback', auth_middleware_1.ensureGuest, auth_controller_1.googleCallback);
    router.post('/auth/register', auth_middleware_1.ensureGuest, (0, validate_middleware_1.default)(auth_schema_1.registerUserSchema), auth_controller_1.registerUser);
    router.post('/auth/login', auth_middleware_1.ensureGuest, (0, validate_middleware_1.default)(auth_schema_1.loginUserSchema), auth_controller_1.loginUser);
    router.get('/auth/me', auth_middleware_1.verifyJWT, auth_controller_1.getUserData);
    router.get('/auth/logout', auth_middleware_1.verifyJWT, auth_controller_1.logoutUser);
    router.get('/auth/refresh', auth_controller_1.refreshAccessToken);
    router.put('/auth/update', auth_middleware_1.verifyJWT, (0, validate_middleware_1.default)(auth_schema_1.updateUserSchema), auth_controller_1.updateUserInfo);
};
exports.default = authRouter;
