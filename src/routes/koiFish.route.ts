import express from "express"

import { Role } from "~/constants/type"
import KoiFishController from "~/controllers/koiFish.controller"
import authMiddleware from "~/middlewares/auth.middleware"

const router = express.Router()

/**
 * @swagger
 * /api/koi-fishes:
 *   get:
 *     tags:
 *       - koi-fish
 *     summary: Api for get koi fishes
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
 *         description: Keyword to search in koi fish names or descriptions
 *     responses:
 *       200:
 *         description: Returns a list of koi fishes
 */
router.get("/", KoiFishController.getKoiFishes)

/**
 * @swagger
 * /api/koi-fishes/{id}:
 *   get:
 *     tags:
 *       - koi-fish
 *     summary: Api for get koi fish by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Koi fish Id
 *     responses:
 *       200:
 *         description: Returns a koi fish object
 */
router.get("/:id", KoiFishController.getKoiFishById)

/**
 * @swagger
 * /api/koi-fishes:
 *   post:
 *     tags:
 *       - koi-fish
 *     summary: Api for create koi fish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               varietyId:
 *                 type: string
 *                 description: Variety Id
 *               name:
 *                 type: string
 *                 description: Koi fish name
 *               description:
 *                 type: string
 *                 description: Koi fish description
 *               gender:
 *                 type: string
 *                 description: Koi fish gender
 *               isSold:
 *                 type: boolean
 *                 description: Koi fish is sold or not
 *               supplierId:
 *                 type: string
 *                 description: Supplier Id
 *               price:
 *                 type: number
 *                 description: Koi fish price
 *               size:
 *                 type: number
 *                 description: Koi fish size
 *               elementIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: list of elementIds - string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: list of imageUrls - string
 *     responses:
 *       201:
 *         description: Returns a created koi fish object
 */
router.post("/", KoiFishController.createKoiFish)

/**
 * @swagger
 * /api/koi-fishes/{id}:
 *   put:
 *     tags:
 *       - koi-fish
 *     summary: Api for update koi fish
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Koi fish Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               varietyId:
 *                 type: string
 *                 description: Variety Id
 *               name:
 *                 type: string
 *                 description: Koi fish name
 *               description:
 *                 type: string
 *                 description: Koi fish description
 *               gender:
 *                 type: string
 *                 description: Koi fish gender
 *               isSold:
 *                 type: boolean
 *                 description: Koi fish is sold or not
 *               supplierId:
 *                 type: string
 *                 description: Supplier Id
 *               price:
 *                 type: number
 *                 description: Koi fish price
 *               size:
 *                 type: number
 *                 description: Koi fish size
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.put("/:id", authMiddleware.verifyToken, KoiFishController.updateKoiFish)

/**
 * @swagger
 * /api/koi-fishes/{id}:
 *   delete:
 *     tags:
 *       - koi-fish
 *     summary: Api for delete koi fish
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Koi fish Id
 *     responses:
 *       200:
 *         description: Returns a message
 */
router.delete("/:id", authMiddleware.verifyToken, KoiFishController.deleteKoiFish)

export default router
