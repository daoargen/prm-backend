import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Supplier } from "./supplier.model"

const tableName = "Product"

export const Product = sequelize.define<ProductInstance>(tableName, {
  ...UUIDModel,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ...SQLModel
})

Product.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier"
})

export interface ProductAttributes {
  id?: string
  name: string
  description: string | null
  stock: number
  price: number
  supplierId: string
  isDeleted?: boolean
}

// Define ProductInstance interface
export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {}
