import express from "express"

import { Role } from "~/constants/type"
import SupplierController from "~/controllers/supplier.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     tags:
 *       - supplier
 *     summary: Api for get suppliers
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
 *         description: Keyword to search in supplier names, descriptions, phone numbers or emails
 *     responses:
 *       200:
 *         description: Returns a list of suppliers
 */
router.get("/", SupplierController.getSuppliers)

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     tags:
 *       - supplier
 *     summary: Api for get supplier by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     responses:
 *       200:
 *         description: Returns a supplier object
 */
router.get("/:id", SupplierController.getSupplierById)

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     tags:
 *       - supplier
 *     summary: Api for create supplier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *               description:
 *                 type: string
 *                 description: Supplier description
 *               phoneNumber:
 *                 type: string
 *                 description: Supplier phone number
 *               email:
 *                 type: string
 *                 description: Supplier email
 *     responses:
 *       201:
 *         description: Returns a created supplier object
 */
router.post("/", SupplierController.createSupplier)

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     tags:
 *       - supplier
 *     summary: Api for update supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *               description:
 *                 type: string
 *                 description: Supplier description
 *               phoneNumber:
 *                 type: string
 *                 description: Supplier phone number
 *               email:
 *                 type: string
 *                 description: Supplier email
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", authMiddleware.verifyToken, SupplierController.updateSupplier)

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     tags:
 *       - supplier
 *     summary: Api for delete supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", authMiddleware.verifyToken, SupplierController.deleteSupplier)

export default router
