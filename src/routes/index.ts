import express from "express"

import authRouter from "~/routes/auth.route"
import categoryRouter from "~/routes/category.route"
import elementRouter from "~/routes/element.route"
import fishReviewRouter from "~/routes/fishReview.route"
import koiFishRouter from "~/routes/koiFish.route"
import orderRouter from "~/routes/order.route"
import productRouter from "~/routes/product.route"
import productReviewRouter from "~/routes/productReview.route"
import supplierRouter from "~/routes/supplier.route"
import userRouter from "~/routes/user.route"
import varietyRouter from "~/routes/variety.route"

const app = express()

app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/categories", categoryRouter)
app.use("/elements", elementRouter)
app.use("/fish-reviews", fishReviewRouter)
app.use("/koi-fishes", koiFishRouter)
app.use("/orders", orderRouter)
app.use("/products", productRouter)
app.use("/product-reviews", productReviewRouter)
app.use("/suppliers", supplierRouter)
app.use("/varieties", varietyRouter)

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - health
 *     summary: Check health of system
 *     responses:
 *       200:
 *         description: OK
 */
app.use("/health", (_, res) => res.send("OK"))

export default app
