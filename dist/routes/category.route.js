"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - category
 *     summary: Api for get categories
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
 *         description: Keyword to search in category names or descriptions
 *     responses:
 *       200:
 *         description: Returns a list of categories
 */
router.get("/", category_controller_1.default.getCategories);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - category
 *     summary: Api for get category by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Returns a category object
 */
router.get("/:id", category_controller_1.default.getCategoryById);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - category
 *     summary: Api for create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *     responses:
 *       201:
 *         description: Returns a created category object
 */
router.post("/", auth_middleware_1.default.verifyToken, category_controller_1.default.createCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - category
 *     summary: Api for update category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", auth_middleware_1.default.verifyToken, category_controller_1.default.updateCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - category
 *     summary: Api for delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", auth_middleware_1.default.verifyToken, category_controller_1.default.deleteCategory);
exports.default = router;
