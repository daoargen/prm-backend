"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const element_controller_1 = __importDefault(require("../controllers/element.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/elements:
 *   get:
 *     tags:
 *       - element
 *     summary: Api for get elements
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
 *         description: Keyword to search in element names
 *     responses:
 *       200:
 *         description: Returns a list of elements
 */
router.get("/", element_controller_1.default.getElements);
/**
 * @swagger
 * /api/elements/{id}:
 *   get:
 *     tags:
 *       - element
 *     summary: Api for get element by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     responses:
 *       200:
 *         description: Returns a element object
 */
router.get("/:id", element_controller_1.default.getElementById);
/**
 * @swagger
 * /api/elements:
 *   post:
 *     tags:
 *       - element
 *     summary: Api for create element
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Element name
 *               imageUrl:
 *                 type: string
 *                 description: Element image url
 *     responses:
 *       201:
 *         description: Returns a created element object
 */
router.post("/", element_controller_1.default.createElement);
/**
 * @swagger
 * /api/elements/{id}:
 *   put:
 *     tags:
 *       - element
 *     summary: Api for update element
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Element name
 *               imageUrl:
 *                 type: string
 *                 description: Element image url
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", auth_middleware_1.default.verifyToken, element_controller_1.default.updateElement);
/**
 * @swagger
 * /api/elements/{id}:
 *   delete:
 *     tags:
 *       - element
 *     summary: Api for delete element
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Element Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", auth_middleware_1.default.verifyToken, element_controller_1.default.deleteElement);
exports.default = router;
