import express from "express"

import { Role } from "~/constants/type"
import CategoryController from "~/controllers/category.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - category
 *     summary: Api for get categories
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
 *         description: Keyword to search in category names or descriptions
 *     responses:
 *       200:
 *         description: Returns a list of categories
 */
router.get("/", CategoryController.getCategories)

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - category
 *     summary: Api for get category by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Returns a category object
 */
router.get("/:id", CategoryController.getCategoryById)

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - category
 *     summary: Api for create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *     responses:
 *       201:
 *         description: Returns a created category object
 */
router.post("/", CategoryController.createCategory)

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - category
 *     summary: Api for update category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", CategoryController.updateCategory)

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - category
 *     summary: Api for delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", CategoryController.deleteCategory)

export default router
