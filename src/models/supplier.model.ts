import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

const tableName = "Supplier"

export const Supplier = sequelize.define<SupplierInstance>(tableName, {
  ...UUIDModel,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  ...SQLModel
})

export interface SupplierAttributes {
  id?: string
  name: string
  description: string | null
  phoneNumber: string | null
  email: string | null
  isDeleted?: boolean
}

// Define SupplierInstance interface
export interface SupplierInstance extends Model<SupplierAttributes>, SupplierAttributes {}
