"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variety_controller_1 = __importDefault(require("../controllers/variety.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/varieties:
 *   get:
 *     tags:
 *       - variety
 *     summary: Api for get varieties
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
 *         description: Keyword to search in variety names or descriptions
 *     responses:
 *       200:
 *         description: Returns a list of varieties
 */
router.get("/", variety_controller_1.default.getVarieties);
/**
 * @swagger
 * /api/varieties/{id}:
 *   get:
 *     tags:
 *       - variety
 *     summary: Api for get variety by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     responses:
 *       200:
 *         description: Returns a variety object
 */
router.get("/:id", variety_controller_1.default.getVarietyById);
/**
 * @swagger
 * /api/varieties:
 *   post:
 *     tags:
 *       - variety
 *     summary: Api for create variety
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variety name
 *               description:
 *                 type: string
 *                 description: Variety description
 *     responses:
 *       201:
 *         description: Returns a created variety object
 */
router.post("/", variety_controller_1.default.createVariety);
/**
 * @swagger
 * /api/varieties/{id}:
 *   put:
 *     tags:
 *       - variety
 *     summary: Api for update variety
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variety name
 *               description:
 *                 type: string
 *                 description: Variety description
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", auth_middleware_1.default.verifyToken, variety_controller_1.default.updateVariety);
/**
 * @swagger
 * /api/varieties/{id}:
 *   delete:
 *     tags:
 *       - variety
 *     summary: Api for delete variety
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variety Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", auth_middleware_1.default.verifyToken, variety_controller_1.default.deleteVariety);
exports.default = router;
