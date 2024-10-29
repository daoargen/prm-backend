import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { KoiFish } from "./koiFish.model"
import { Order } from "./order.model"
import { Product } from "./product.model"

const tableName = "OrderDetail"

export const OrderDetail = sequelize.define<OrderDetailInstance>(tableName, {
  ...UUIDModel,
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  koiFishId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ...SQLModel
})

OrderDetail.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order"
})

OrderDetail.belongsTo(KoiFish, {
  foreignKey: "koiFishId",
  as: "koiFish"
})

OrderDetail.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
})

export interface OrderDetailAttributes {
  id?: string
  orderId: string
  koiFishId: string | null
  productId: string | null
  type: string
  unitPrice: number
  quantity: number
  totalPrice: number
  isDeleted?: boolean
}

// Define OrderDetailInstance interface
export interface OrderDetailInstance extends Model<OrderDetailAttributes>, OrderDetailAttributes {}
