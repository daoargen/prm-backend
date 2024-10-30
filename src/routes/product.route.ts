import express from "express"

import { Role } from "~/constants/type"
import ProductController from "~/controllers/product.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - prm
 *     summary: Api for get products
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
 *         description: Keyword to search in product names or descriptions
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of what to get ( product, koifish )
 *       - in: query
 *         name: yob
 *         schema:
 *           type: string
 *         description: year of birth
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: category name of product
 *     responses:
 *       200:
 *         description: Returns a list of products
 */
router.get("/", ProductController.getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - product
 *     summary: Api for get product by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product Id
 *     responses:
 *       200:
 *         description: Returns a product object
 */
router.get("/:id", ProductController.getProductById)

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - product
 *     summary: Api for create product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               stock:
 *                 type: number
 *                 description: Product stock
 *               price:
 *                 type: number
 *                 description: Product price
 *               supplierId:
 *                 type: string
 *                 description: Supplier Id
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: list of categoryIds - string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: list of imageUrls - string
 *     responses:
 *       201:
 *         description: Returns a created product object
 */
router.post("/", ProductController.createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - product
 *     summary: Api for update product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               stock:
 *                 type: number
 *                 description: Product stock
 *               price:
 *                 type: number
 *                 description: Product price
 *               supplierId:
 *                 type: string
 *                 description: Supplier Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", ProductController.updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - product
 *     summary: Api for delete product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", ProductController.deleteProduct)

export default router
