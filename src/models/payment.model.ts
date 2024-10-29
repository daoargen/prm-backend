import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Order } from "./order.model"

const tableName = "Payment"

export const Payment = sequelize.define<PaymentInstance>(tableName, {
  ...UUIDModel,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  payMethod: {
    type: DataTypes.ENUM("CARD", "CASH"),
    allowNull: false
  },
  payStatus: {
    type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCEL"),
    allowNull: false,
    defaultValue: "PENDING"
  },
  ...SQLModel
})

Payment.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order"
})

export interface PaymentAttributes {
  id?: string
  orderId: string
  amount: number
  payDate: Date
  payMethod: "CARD" | "COD"
  payStatus: "PENDING" | "COMPLETED" | "CANCEL"
  isDeleted?: boolean
}

// Define PaymentInstance interface
export interface PaymentInstance extends Model<PaymentAttributes>, PaymentAttributes {}
