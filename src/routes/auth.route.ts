import express from "express"

import AuthController from "~/controllers/auth.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for user register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               username:
 *                 type: string
 *                 description: The username of the user, do not contain special characters
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               gender:
 *                 type: string
 *                 enum: ["MALE", "FEMALE", "OTHER"]
 *                 description: The gender of the user
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the user (YYYY-MM-DD)
 *               role:
 *                 type: string
 *                 enum: ["LECTURER", "SUPPORTER", "CONTENT_CREATOR", "MANAGER", "ADMIN"]
 *                 description: If not provided, the default role is "ADULT"
 *     responses:
 *       200:
 *         description: Return messgae "Please check your email to confirm registration"
 *       500:
 *         description: Internal server error
 */
router.post("/register", AuthController.register)

/**
 * @swagger
 * /api/auth/confirm-register:
 *   get:
 *     tags:
 *       - auth
 *     summary: Api for confirm registration
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Redirect to login page
 *       400:
 *         description: Bad request
 */
router.get("/confirm-register", AuthController.confirmRegister)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginKey:
 *                 type: string
 *                 description: The loginKey of user. Username or email
 *                 example: dangkhoa
 *               password:
 *                 type: string
 *                 description: The password of user
 *                 example: 'P@s5Word'
 *     responses:
 *       200:
 *         description: A user object along with tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 */
router.post("/login", AuthController.login)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for user logout
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: Bad request
 */
router.post("/logout", authMiddleware.verifyToken, AuthController.logout)

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for user forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of user
 *     responses:
 *       200:
 *         description: A message
 *       400:
 *         description: Bad request
 */
router.post("/forgot-password", AuthController.forgotPassword)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for reset password after api forgot password
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The reset code sent to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Reset password successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", AuthController.resetPassword)

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for user change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *               confirmPassword:
 *                 type: string
 *                 description: The new password confirm again
 *     responses:
 *       200:
 *         description: Change password successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/change-password", authMiddleware.verifyToken, AuthController.changePassword)

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - auth
 *     summary: Api for refresh the token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: A new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 */
router.post("/refresh-token", AuthController.getRefreshToken)

export default router
