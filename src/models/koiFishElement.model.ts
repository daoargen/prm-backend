import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Element } from "./element.model"
import { KoiFish } from "./koiFish.model"

const tableName = "KoiFishElement"

export const KoiFishElement = sequelize.define<KoiFishElementInstance>(tableName, {
  ...UUIDModel,
  koiFishId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  elementId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ...SQLModel
})

KoiFishElement.belongsTo(KoiFish, {
  foreignKey: "koiFishId",
  as: "koiFish"
})

KoiFishElement.belongsTo(Element, {
  foreignKey: "elementId",
  as: "element"
})

export interface KoiFishElementAttributes {
  id?: string
  koiFishId: string
  elementId: string
  isDeleted?: boolean
}

// Define KoiFishElementInstance interface
export interface KoiFishElementInstance extends Model<KoiFishElementAttributes>, KoiFishElementAttributes {}
