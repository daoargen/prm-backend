"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const supplier_model_1 = require("../models/supplier.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getSuppliers(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${keyword}%` } },
                { description: { [sequelize_1.Op.like]: `%${keyword}%` } },
                { phoneNumber: { [sequelize_1.Op.like]: `%${keyword}%` } },
                { email: { [sequelize_1.Op.like]: `%${keyword}%` } }
            ];
        }
        const { count, rows: suppliers } = await supplier_model_1.Supplier.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = suppliers.map((supplier) => (0, formatTimeModel_util_1.formatModelDate)(supplier.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { suppliers: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getSupplierById(id) {
    try {
        const supplier = await supplier_model_1.Supplier.findOne({ where: { id, isDeleted: false } });
        if (!supplier) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nhà cung cấp");
        }
        return supplier;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createSupplier(newSupplier) {
    try {
        const createdSupplier = await supplier_model_1.Supplier.create({
            name: newSupplier.name,
            description: newSupplier.description,
            phoneNumber: newSupplier.phoneNumber,
            email: newSupplier.email
        });
        return createdSupplier;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateSupplier(id, updatedSupplier) {
    try {
        const supplier = await supplier_model_1.Supplier.findOne({ where: { id, isDeleted: false } });
        if (!supplier) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nhà cung cấp");
        }
        supplier.name = updatedSupplier.name || supplier.name;
        supplier.description = updatedSupplier.description || supplier.description;
        supplier.phoneNumber = updatedSupplier.phoneNumber || supplier.phoneNumber;
        supplier.email = updatedSupplier.email || supplier.email;
        await supplier.save();
        return "Cập nhật nhà cung cấp thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteSupplier(id) {
    try {
        const supplier = await supplier_model_1.Supplier.findOne({ where: { id, isDeleted: false } });
        if (!supplier) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nhà cung cấp");
        }
        supplier.isDeleted = true;
        await supplier.save();
        return "Xóa nhà cung cấp thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
