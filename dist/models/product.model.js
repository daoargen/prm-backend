"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const supplier_model_1 = require("./supplier.model");
const tableName = "Product";
exports.Product = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    supplierId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.Product.belongsTo(supplier_model_1.Supplier, {
    foreignKey: "supplierId",
    as: "supplier"
});
