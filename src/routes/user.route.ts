import express from "express"

import { Role } from "~/constants/type"
import UserController from "~/controllers/user.controller"
import authMiddleware from "~/middlewares/auth.middleware"
import userMiddleware from "~/validations/user.validation"

const router = express.Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - user
 *     summary: Api for get users
 *     parameters:
 *       - in: query
 *         name: page_index
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in user names or emails
 *     responses:
 *       200:
 *         description: Returns a list of users
 */
router.get("/", authMiddleware.verifyMinimumRole(Role.ADMIN), UserController.getUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - user
 *     summary: Api for get user by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Id
 *     responses:
 *       200:
 *         description: Returns a user object
 */
router.get("/:id", UserController.getUser)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - user
 *     summary: Api for edit user details
 *     description: Update user details by user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER, UNKNOWN]
 *                 description: User's gender
 *               avatarUrl:
 *                 type: string
 *                 description: URL of user's avatar
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 204
 *                 message:
 *                   type: string
 *                   example: Edit user successfully!
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User detail not found
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Failed to update user detail
 */
router.put("/:id", authMiddleware.verifyToken, userMiddleware.validateUser, UserController.editUser)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Api for delete user by Id (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       204:
 *         description: No Content, user deleted successfully
 *       404:
 *         description: User not found or already deleted
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware.verifyMinimumRole(Role.ADMIN), UserController.deleteUser)

export default router
