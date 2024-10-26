"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const supplier_service_1 = __importDefault(require("../services/supplier.service"));
async function getSuppliers(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { suppliers, pagination } = await supplier_service_1.default.getSuppliers(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get suppliers successfully!", suppliers, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getSupplierById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await supplier_service_1.default.getSupplierById(id);
        return res.json(responseStatus_1.default.responseData200("Get supplier successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createSupplier(req, res) {
    try {
        const { name, description, phoneNumber, email } = req.body;
        if (!name) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description,
            phoneNumber,
            email
        };
        const dataResponse = await supplier_service_1.default.createSupplier(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create supplier successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateSupplier(req, res) {
    try {
        const id = req.params.id;
        const { name, description, phoneNumber, email } = req.body;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description,
            phoneNumber,
            email
        };
        const dataResponse = await supplier_service_1.default.updateSupplier(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteSupplier(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await supplier_service_1.default.deleteSupplier(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
