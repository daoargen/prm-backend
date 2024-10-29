import express from "express"

import { Role } from "~/constants/type"
import VarietyController from "~/controllers/variety.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/varieties:
 *   get:
 *     tags:
 *       - variety
 *     summary: Api for get varieties
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
 *         description: Keyword to search in variety names or descriptions
 *     responses:
 *       200:
 *         description: Returns a list of varieties
 */
router.get("/", VarietyController.getVarieties)

/**
 * @swagger
 * /api/varieties/{id}:
 *   get:
 *     tags:
 *       - variety
 *     summary: Api for get variety by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     responses:
 *       200:
 *         description: Returns a variety object
 */
router.get("/:id", VarietyController.getVarietyById)

/**
 * @swagger
 * /api/varieties:
 *   post:
 *     tags:
 *       - variety
 *     summary: Api for create variety
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variety name
 *               description:
 *                 type: string
 *                 description: Variety description
 *     responses:
 *       201:
 *         description: Returns a created variety object
 */
router.post("/", VarietyController.createVariety)

/**
 * @swagger
 * /api/varieties/{id}:
 *   put:
 *     tags:
 *       - variety
 *     summary: Api for update variety
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variety name
 *               description:
 *                 type: string
 *                 description: Variety description
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", VarietyController.updateVariety)

/**
 * @swagger
 * /api/varieties/{id}:
 *   delete:
 *     tags:
 *       - variety
 *     summary: Api for delete variety
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", VarietyController.deleteVariety)

export default router
