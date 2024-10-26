"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const orderDetail_model_1 = require("../models/orderDetail.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getOrderDetails(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: orderDetails } = await orderDetail_model_1.OrderDetail.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = orderDetails.map((orderDetail) => (0, formatTimeModel_util_1.formatModelDate)(orderDetail.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { orderDetails: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getOrderDetailById(id) {
    try {
        const orderDetail = await orderDetail_model_1.OrderDetail.findOne({ where: { id, isDeleted: false } });
        if (!orderDetail) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy chi tiết đơn hàng");
        }
        return orderDetail;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createOrderDetail(newOrderDetail) {
    try {
        const createdOrderDetail = await orderDetail_model_1.OrderDetail.create({
            orderId: newOrderDetail.orderId,
            koiFishId: newOrderDetail.koiFishId,
            productId: newOrderDetail.productId,
            type: newOrderDetail.type,
            unitPrice: newOrderDetail.unitPrice,
            totalPrice: newOrderDetail.totalPrice
        });
        return createdOrderDetail;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateOrderDetail(id, updatedOrderDetail) {
    try {
        const orderDetail = await orderDetail_model_1.OrderDetail.findOne({ where: { id, isDeleted: false } });
        if (!orderDetail) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy chi tiết đơn hàng");
        }
        orderDetail.orderId = updatedOrderDetail.orderId || orderDetail.orderId;
        orderDetail.koiFishId = updatedOrderDetail.koiFishId || orderDetail.koiFishId;
        orderDetail.productId = updatedOrderDetail.productId || orderDetail.productId;
        orderDetail.type = updatedOrderDetail.type || orderDetail.type;
        orderDetail.unitPrice = updatedOrderDetail.unitPrice || orderDetail.unitPrice;
        orderDetail.totalPrice = updatedOrderDetail.totalPrice || orderDetail.totalPrice;
        await orderDetail.save();
        return "Cập nhật chi tiết đơn hàng thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteOrderDetail(id) {
    try {
        const orderDetail = await orderDetail_model_1.OrderDetail.findOne({ where: { id, isDeleted: false } });
        if (!orderDetail) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy chi tiết đơn hàng");
        }
        orderDetail.isDeleted = true;
        await orderDetail.save();
        return "Xóa chi tiết đơn hàng thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
};
