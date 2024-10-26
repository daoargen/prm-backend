"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetail = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const koiFish_model_1 = require("./koiFish.model");
const order_model_1 = require("./order.model");
const product_model_1 = require("./product.model");
const tableName = "OrderDetail";
exports.OrderDetail = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    orderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    koiFishId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    unitPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.OrderDetail.belongsTo(order_model_1.Order, {
    foreignKey: "orderId",
    as: "order"
});
exports.OrderDetail.belongsTo(koiFish_model_1.KoiFish, {
    foreignKey: "koiFishId",
    as: "koiFish"
});
exports.OrderDetail.belongsTo(product_model_1.Product, {
    foreignKey: "productId",
    as: "product"
});
