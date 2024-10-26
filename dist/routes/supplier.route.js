"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplier_controller_1 = __importDefault(require("../controllers/supplier.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     tags:
 *       - supplier
 *     summary: Api for get suppliers
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
 *         description: Keyword to search in supplier names, descriptions, phone numbers or emails
 *     responses:
 *       200:
 *         description: Returns a list of suppliers
 */
router.get("/", supplier_controller_1.default.getSuppliers);
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     tags:
 *       - supplier
 *     summary: Api for get supplier by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     responses:
 *       200:
 *         description: Returns a supplier object
 */
router.get("/:id", supplier_controller_1.default.getSupplierById);
/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     tags:
 *       - supplier
 *     summary: Api for create supplier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *               description:
 *                 type: string
 *                 description: Supplier description
 *               phoneNumber:
 *                 type: string
 *                 description: Supplier phone number
 *               email:
 *                 type: string
 *                 description: Supplier email
 *     responses:
 *       201:
 *         description: Returns a created supplier object
 */
router.post("/", supplier_controller_1.default.createSupplier);
/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     tags:
 *       - supplier
 *     summary: Api for update supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *               description:
 *                 type: string
 *                 description: Supplier description
 *               phoneNumber:
 *                 type: string
 *                 description: Supplier phone number
 *               email:
 *                 type: string
 *                 description: Supplier email
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", auth_middleware_1.default.verifyToken, supplier_controller_1.default.updateSupplier);
/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     tags:
 *       - supplier
 *     summary: Api for delete supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Supplier Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", auth_middleware_1.default.verifyToken, supplier_controller_1.default.deleteSupplier);
exports.default = router;
