"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productReview_controller_1 = __importDefault(require("../controllers/productReview.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
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
router.post("/", auth_middleware_1.default.verifyToken, productReview_controller_1.default.createProductReview);
exports.default = router;
