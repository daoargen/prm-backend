import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import { Role } from "~/constants/type"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

const tableName = "User"

export const User = sequelize.define<UserInstance>(tableName, {
  ...UUIDModel,
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("USER", "ADMIN"),
    allowNull: false
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  ...SQLModel
})

export interface UserAttributes {
  id?: string
  email: string | null
  username: string
  password: string
  role: Role
  parentId?: string
  isDeleted?: boolean
}

// Define UserInstance interface
export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
