"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const product_service_1 = __importDefault(require("../services/product.service"));
async function getProducts(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { products, pagination } = await product_service_1.default.getProducts(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get products successfully!", products, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getProductById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await product_service_1.default.getProductById(id);
        return res.json(responseStatus_1.default.responseData200("Get product successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createProduct(req, res) {
    try {
        const { name, description, stock, price, supplierId } = req.body;
        if (!name || !price || !supplierId) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description,
            stock,
            price,
            supplierId
        };
        const dataResponse = await product_service_1.default.createProduct(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create product successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const { name, description, stock, price, supplierId } = req.body;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description,
            stock,
            price,
            supplierId
        };
        const dataResponse = await product_service_1.default.updateProduct(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await product_service_1.default.deleteProduct(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
