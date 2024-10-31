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
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number
 *               productId:
 *                 type: string
 *                 description: Product Id
 *               rating:
 *                 type: integer
 *                 description: rating review content
 *               content:
 *                 type: string
 *                 description: Product review content
 *     responses:
 *       201:
 *         description: Returns a created product review object
 */
router.post("/", ProductReviewController.createProductReview)

export default router
