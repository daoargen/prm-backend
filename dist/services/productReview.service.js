"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const productReview_model_1 = require("../models/productReview.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getProductReviews(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: productReviews } = await productReview_model_1.ProductReview.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = productReviews.map((productReview) => (0, formatTimeModel_util_1.formatModelDate)(productReview.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { productReviews: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getProductReviewById(id) {
    try {
        const productReview = await productReview_model_1.ProductReview.findOne({ where: { id, isDeleted: false } });
        if (!productReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá sản phẩm");
        }
        return productReview;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createProductReview(newProductReview) {
    try {
        const createdProductReview = await productReview_model_1.ProductReview.create({
            userId: newProductReview.userId,
            productId: newProductReview.productId,
            content: newProductReview.content
        });
        return createdProductReview;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateProductReview(id, updatedProductReview) {
    try {
        const productReview = await productReview_model_1.ProductReview.findOne({ where: { id, isDeleted: false } });
        if (!productReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá sản phẩm");
        }
        productReview.userId = updatedProductReview.userId || productReview.userId;
        productReview.productId = updatedProductReview.productId || productReview.productId;
        productReview.content = updatedProductReview.content || productReview.content;
        await productReview.save();
        return "Cập nhật đánh giá sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteProductReview(id) {
    try {
        const productReview = await productReview_model_1.ProductReview.findOne({ where: { id, isDeleted: false } });
        if (!productReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá sản phẩm");
        }
        productReview.isDeleted = true;
        await productReview.save();
        return "Xóa đánh giá sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getProductReviews,
    getProductReviewById,
    createProductReview,
    updateProductReview,
    deleteProductReview
};
