// Define ElementInstance interface
export interface ElementInstance extends Model<ElementAttributes>, ElementAttributes {}

import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

const tableName = "Element"

export const Element = sequelize.define<ElementInstance>(tableName, {
  ...UUIDModel,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ...SQLModel
})

export interface ElementAttributes {
  id?: string
  name: string
  imageUrl: string
  isDeleted?: boolean
}

// Define ElementInstance interface
export interface ElementInstance extends Model<ElementAttributes>, ElementAttributes {}
