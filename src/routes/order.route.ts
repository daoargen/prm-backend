import express from "express"

import { Role } from "~/constants/type"
import orderController from "~/controllers/order.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - order
 *     summary: Api for get orders
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
 *         description: Keyword to search
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: phoneNumber to search
 *     responses:
 *       200:
 *         description: Returns a list of orders
 */
router.get("/", orderController.getOrders)

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - order
 *     summary: Api for get order by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order Id
 *     responses:
 *       200:
 *         description: Returns a order object
 */
router.get("/:id", orderController.getOrderById)

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       - order
 *     summary: Api for create order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the customer
 *               email:
 *                 type: string
 *                 description: email of the customer
 *               address:
 *                 type: string
 *                 description: address of the customer
 *               payMethod:
 *                 type: string
 *                 description: Pay method of the customer
 *               orderDetails:
 *                 type: array
 *                 description: List of order details
 *                 items:
 *                   type: object
 *                   properties:
 *                     koiFishId:
 *                       type: string
 *                       description: ID of the koi fish (if applicable)
 *                     productId:
 *                       type: string
 *                       description: ID of the product (if applicable)
 *                     type:
 *                       type: string
 *                       enum: [KOIFISH, PRODUCT]
 *                       description: Type of order detail
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the item
 *     responses:
 *       201:
 *         description: Returns a created order object
 */
router.post("/", orderController.createOrder)

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     tags:
 *       - order
 *     summary: Api for update order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING_CONFIRMATION, IN_TRANSIT, COMPLETED, CANCEL]
 *                 description: Order status
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", orderController.editOrder)

/**
 * @swagger
 * /api/orders/{id}/confirm:
 *   put:
 *     tags:
 *       - order
 *     summary: Api for confirm order if pay method is COD, the order start transit, if pay method is CARD, the order start payment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id/confirm", orderController.confirmOrder)

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags:
 *       - order
 *     summary: Api for delete order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", orderController.deleteOrder)

export default router
