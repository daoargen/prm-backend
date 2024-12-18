import express from "express"

import FishReviewController from "~/controllers/fishReview.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/fish-reviews:
 *   post:
 *     tags:
 *       - fish-review
 *     summary: Api for create fish review
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
 *               koiFishId:
 *                 type: string
 *                 description: Koi Fish Id
 *               rating:
 *                 type: integer
 *                 description: rating review content
 *               content:
 *                 type: string
 *                 description: Fish Review content
 *     responses:
 *       201:
 *         description: Returns a created fish review object
 */
router.post("/", FishReviewController.createFishReview)

export default router
