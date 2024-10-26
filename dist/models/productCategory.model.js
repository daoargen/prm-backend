"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const category_model_1 = require("./category.model");
const product_model_1 = require("./product.model");
const tableName = "ProductCategory";
exports.ProductCategory = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.ProductCategory.belongsTo(product_model_1.Product, {
    foreignKey: "productId",
    as: "product"
});
exports.ProductCategory.belongsTo(category_model_1.Category, {
    foreignKey: "categoryId",
    as: "category"
});
