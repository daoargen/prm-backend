"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoiFish = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const supplier_model_1 = require("./supplier.model");
const variety_model_1 = require("./variety.model");
const tableName = "KoiFish";
exports.KoiFish = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    varietyId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: true
    },
    isSold: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    supplierId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.KoiFish.belongsTo(variety_model_1.Variety, {
    foreignKey: "varietyId",
    as: "variety"
});
exports.KoiFish.belongsTo(supplier_model_1.Supplier, {
    foreignKey: "supplierId",
    as: "supplier"
});
