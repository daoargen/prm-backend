import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { User } from "./user.model"

const tableName = "Order"

export const Order = sequelize.define<OrderInstance>(tableName, {
  ...UUIDModel,
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  packageId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("PENDING_CONFIRMATION", "COMPLETED", "CANCEL"),
    allowNull: false,
    defaultValue: "PENDING_CONFIRMATION"
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ...SQLModel
})

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

export interface OrderAttributes {
  id?: string
  userId: string
  packageId: string | null
  postId: string | null
  status: "PENDING_CONFIRMATION" | "COMPLETED" | "CANCEL"
  totalAmount: number
  isDeleted?: boolean
}

// Define OrderInstance interface
export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {}
