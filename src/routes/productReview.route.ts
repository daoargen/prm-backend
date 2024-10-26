import express from "express"

import ProductReviewController from "~/controllers/productReview.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/product-reviews:
 *   post:
 *     tags:
 *       - product-review
 *     summary: Api for create product review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User Id
 *               productId:
 *                 type: string
 *                 description: Product Id
 *               content:
 *                 type: string
 *                 description: Product review content
 *     responses:
 *       201:
 *         description: Returns a created product review object
 */
router.post("/", authMiddleware.verifyToken, ProductReviewController.createProductReview)

export default router
