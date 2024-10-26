"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const productCategory_model_1 = require("../models/productCategory.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getProductCategories(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: productCategories } = await productCategory_model_1.ProductCategory.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = productCategories.map((productCategory) => (0, formatTimeModel_util_1.formatModelDate)(productCategory.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { productCategories: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getProductCategoryById(id) {
    try {
        const productCategory = await productCategory_model_1.ProductCategory.findOne({ where: { id, isDeleted: false } });
        if (!productCategory) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục sản phẩm");
        }
        return productCategory;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createProductCategory(newProductCategory) {
    try {
        const createdProductCategory = await productCategory_model_1.ProductCategory.create({
            productId: newProductCategory.productId,
            categoryId: newProductCategory.categoryId
        });
        return createdProductCategory;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateProductCategory(id, updatedProductCategory) {
    try {
        const productCategory = await productCategory_model_1.ProductCategory.findOne({ where: { id, isDeleted: false } });
        if (!productCategory) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục sản phẩm");
        }
        productCategory.productId = updatedProductCategory.productId || productCategory.productId;
        productCategory.categoryId = updatedProductCategory.categoryId || productCategory.categoryId;
        await productCategory.save();
        return "Cập nhật danh mục sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteProductCategory(id) {
    try {
        const productCategory = await productCategory_model_1.ProductCategory.findOne({ where: { id, isDeleted: false } });
        if (!productCategory) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục sản phẩm");
        }
        productCategory.isDeleted = true;
        await productCategory.save();
        return "Xóa danh mục sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getProductCategories,
    getProductCategoryById,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory
};
