"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReview = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const product_model_1 = require("./product.model");
const user_model_1 = require("./user.model");
const tableName = "ProductReview";
exports.ProductReview = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.ProductReview.belongsTo(user_model_1.User, {
    foreignKey: "userId",
    as: "user"
});
exports.ProductReview.belongsTo(product_model_1.Product, {
    foreignKey: "productId",
    as: "product"
});
