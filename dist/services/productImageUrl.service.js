"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const productImageUrl_model_1 = require("../models/productImageUrl.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getProductImageUrls(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: productImageUrls } = await productImageUrl_model_1.ProductImageUrl.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = productImageUrls.map((productImageUrl) => (0, formatTimeModel_util_1.formatModelDate)(productImageUrl.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { productImageUrls: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getProductImageUrlById(id) {
    try {
        const productImageUrl = await productImageUrl_model_1.ProductImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!productImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh sản phẩm");
        }
        return productImageUrl;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createProductImageUrl(newProductImageUrl) {
    try {
        const createdProductImageUrl = await productImageUrl_model_1.ProductImageUrl.create({
            productId: newProductImageUrl.productId,
            imageUrl: newProductImageUrl.imageUrl
        });
        return createdProductImageUrl;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateProductImageUrl(id, updatedProductImageUrl) {
    try {
        const productImageUrl = await productImageUrl_model_1.ProductImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!productImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh sản phẩm");
        }
        productImageUrl.productId = updatedProductImageUrl.productId || productImageUrl.productId;
        productImageUrl.imageUrl = updatedProductImageUrl.imageUrl || productImageUrl.imageUrl;
        await productImageUrl.save();
        return "Cập nhật ảnh sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteProductImageUrl(id) {
    try {
        const productImageUrl = await productImageUrl_model_1.ProductImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!productImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh sản phẩm");
        }
        productImageUrl.isDeleted = true;
        await productImageUrl.save();
        return "Xóa ảnh sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getProductImageUrls,
    getProductImageUrlById,
    createProductImageUrl,
    updateProductImageUrl,
    deleteProductImageUrl
};
