"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const productReview_service_1 = __importDefault(require("../services/productReview.service"));
async function createProductReview(req, res) {
    try {
        const { userId, productId, content } = req.body;
        if (!userId || !productId || !content) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            userId,
            productId,
            content
        };
        const dataResponse = await productReview_service_1.default.createProductReview(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create product review successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    createProductReview
};
