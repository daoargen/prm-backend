"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const product_model_1 = require("../models/product.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getProducts(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition[sequelize_1.Op.or] = [{ name: { [sequelize_1.Op.like]: `%${keyword}%` } }, { description: { [sequelize_1.Op.like]: `%${keyword}%` } }];
        }
        const { count, rows: products } = await product_model_1.Product.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = products.map((product) => (0, formatTimeModel_util_1.formatModelDate)(product.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { products: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getProductById(id) {
    try {
        const product = await product_model_1.Product.findOne({ where: { id, isDeleted: false } });
        if (!product) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy sản phẩm");
        }
        return product;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createProduct(newProduct) {
    try {
        const createdProduct = await product_model_1.Product.create({
            name: newProduct.name,
            description: newProduct.description,
            stock: newProduct.stock,
            price: newProduct.price,
            supplierId: newProduct.supplierId
        });
        return createdProduct;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateProduct(id, updatedProduct) {
    try {
        const product = await product_model_1.Product.findOne({ where: { id, isDeleted: false } });
        if (!product) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy sản phẩm");
        }
        product.name = updatedProduct.name || product.name;
        product.description = updatedProduct.description || product.description;
        product.stock = updatedProduct.stock || product.stock;
        product.price = updatedProduct.price || product.price;
        product.supplierId = updatedProduct.supplierId || product.supplierId;
        await product.save();
        return "Cập nhật sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteProduct(id) {
    try {
        const product = await product_model_1.Product.findOne({ where: { id, isDeleted: false } });
        if (!product) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy sản phẩm");
        }
        product.isDeleted = true;
        await product.save();
        return "Xóa sản phẩm thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
