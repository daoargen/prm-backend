import express from "express"

import { Role } from "~/constants/type"
import ElementController from "~/controllers/element.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/elements:
 *   get:
 *     tags:
 *       - element
 *     summary: Api for get elements
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
 *         description: Keyword to search in element names
 *     responses:
 *       200:
 *         description: Returns a list of elements
 */
router.get("/", ElementController.getElements)

/**
 * @swagger
 * /api/elements/{id}:
 *   get:
 *     tags:
 *       - element
 *     summary: Api for get element by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     responses:
 *       200:
 *         description: Returns a element object
 */
router.get("/:id", ElementController.getElementById)

/**
 * @swagger
 * /api/elements:
 *   post:
 *     tags:
 *       - element
 *     summary: Api for create element
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Element name
 *               imageUrl:
 *                 type: string
 *                 description: Element image url
 *     responses:
 *       201:
 *         description: Returns a created element object
 */
router.post("/", ElementController.createElement)

/**
 * @swagger
 * /api/elements/{id}:
 *   put:
 *     tags:
 *       - element
 *     summary: Api for update element
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Element name
 *               imageUrl:
 *                 type: string
 *                 description: Element image url
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", authMiddleware.verifyToken, ElementController.updateElement)

/**
 * @swagger
 * /api/elements/{id}:
 *   delete:
 *     tags:
 *       - element
 *     summary: Api for delete element
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", authMiddleware.verifyToken, ElementController.deleteElement)

export default router
