import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { User } from "./user.model"

const tableName = "Order"

export const Order = sequelize.define<OrderInstance>(tableName, {
  ...UUIDModel,
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("PENDING", "TRANSIT", "COMPLETED", "CANCEL"),
    allowNull: false,
    defaultValue: "PENDING"
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ...SQLModel
})

export interface OrderAttributes {
  id?: string
  phoneNumber: string
  email: string
  address: string
  status: "PENDING" | "TRANSIT" | "COMPLETED" | "CANCEL"
  totalAmount: number
  isDeleted?: boolean
}

// Define OrderInstance interface
export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {}
