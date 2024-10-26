"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const category_route_1 = __importDefault(require("../routes/category.route"));
const element_route_1 = __importDefault(require("../routes/element.route"));
const fishReview_route_1 = __importDefault(require("../routes/fishReview.route"));
const koiFish_route_1 = __importDefault(require("../routes/koiFish.route"));
const product_route_1 = __importDefault(require("../routes/product.route"));
const productReview_route_1 = __importDefault(require("../routes/productReview.route"));
const supplier_route_1 = __importDefault(require("../routes/supplier.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const variety_route_1 = __importDefault(require("../routes/variety.route"));
const app = (0, express_1.default)();
app.use("/users", user_route_1.default);
app.use("/auth", auth_route_1.default);
app.use("/categories", category_route_1.default);
app.use("/elements", element_route_1.default);
app.use("/fish-reviews", fishReview_route_1.default);
app.use("/koi-fishes", koiFish_route_1.default);
app.use("/products", product_route_1.default);
app.use("/product-reviews", productReview_route_1.default);
app.use("/suppliers", supplier_route_1.default);
app.use("/varieties", variety_route_1.default);
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
app.use("/health", (_, res) => res.send("OK"));
exports.default = app;
