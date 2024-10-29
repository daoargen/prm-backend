import express from "express"

import { Role } from "~/constants/type"
import PaymentController from "~/controllers/payment.controller"
import authMiddleware from "~/middlewares/auth.middleware"
// import paymentMiddleware from '~/validations/payment.validation'; // Import if you have validation middleware

const router = express.Router()

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     tags:
 *       - payment
 *     summary: Webhook for handling payment completion from Sepay
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Payment code from Sepay webhook
 *               transferAmount:
 *                 type: number
 *                 description: Payment amount from Sepay webhook
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *       404:
 *         description: Payment not found
 *       400:
 *         description: Payment already completed
 *       500:
 *         description: Internal server error
 */
router.post("/webhook", authMiddleware.verifyToken, PaymentController.completePaymentFromWebhook)

/**
 * @swagger
 * /api/payments/{id}/cancel:
 *   post:
 *     tags:
 *       - payment
 *     summary: Api for cancelling a payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the payment to cancel
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *       404:
 *         description: Payment not found
 *       400:
 *         description: Payment already cancelled
 *       500:
 *         description: Internal server error
 */
router.post("/:id/cancel", authMiddleware.verifyToken, PaymentController.cancelPayment)

export default router
