import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { User } from "./user.model"

const tableName = "UserDetail"

export const UserDetail = sequelize.define<UserDetailInstance>(tableName, {
  ...UUIDModel,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ...SQLModel
})

UserDetail.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

export interface UserDetailAttributes {
  userId: string
  phone: string | null
  firstName: string
  lastName: string
  dob: Date
  gender: "MALE" | "FEMALE" | "OTHER"
  avatarUrl: string
  isDeleted?: boolean
}

// Define UserDetailInstance interface
export interface UserDetailInstance extends Model<UserDetailAttributes>, UserDetailAttributes {}
