"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fishReview_controller_1 = __importDefault(require("../controllers/fishReview.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
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
 *               userId:
 *                 type: string
 *                 description: User Id
 *               koiFishId:
 *                 type: string
 *                 description: Koi Fish Id
 *               content:
 *                 type: string
 *                 description: Fish Review content
 *     responses:
 *       201:
 *         description: Returns a created fish review object
 */
router.post("/", auth_middleware_1.default.verifyToken, fishReview_controller_1.default.createFishReview);
exports.default = router;
