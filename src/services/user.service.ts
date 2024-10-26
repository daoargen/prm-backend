import { Request } from "express"
import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { UpdateUserAvatar, UpdateUserDetail } from "~/constants/type"
import { User } from "~/models/user.model"
import { UserDetail } from "~/models/userDetail.model"
import { formatModelDate } from "~/utils/formatTimeModel.util"

async function getAllUsers(req: Request) {
  try {
    // Xử lý tham số query và gán giá trị mặc định nếu không có
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string

    const whereCondition: any = {
      isDeleted: false
    } // Điều kiện tìm kiếm

    if (keyword) {
      whereCondition[Op.or] = [
        { email: { [Op.like]: `%${keyword}%` } }
        // Có thể thêm các điều kiện tìm kiếm khác nếu cần
      ]
    }

    // Tìm và đếm tổng số người dùng
    const { count, rows: users } = await User.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    // Định dạng lại dữ liệu người dùng
    const formattedUsers = users.map((user) => formatModelDate(user.dataValues))

    // Tính toán thông tin phân trang
    const totalPage = Math.ceil(count / pageSize)
    const pagination = {
      pageSize,
      totalItem: count,
      currentPage: pageIndex,
      maxPageSize: 100,
      totalPage
    }

    // Trả về kết quả
    return { users: formattedUsers, pagination }
  } catch (error) {
    console.error(error)
    throw error
  }
} // Get all users

async function getUserById(userId: string) {
  try {
    const userDetail = await UserDetail.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "username", "role"]
        }
      ],
      attributes: { exclude: ["isDeleted", "createdAt", "updatedAt"] }
    })
    if (!userDetail) throw responseStatus.responseNotFound404("User not found")
    return userDetail
  } catch (error) {
    console.error(error)
    throw error
  }
} // Find user by id

async function editUser(id: string, newUser: UpdateUserDetail) {
  try {
    // Kiểm tra xem UserDetail có tồn tại không
    const userDetail = await UserDetail.findOne({
      where: { userId: id, isDeleted: false }
    })

    if (!userDetail) {
      throw responseStatus.responseNotFound404("User detail not found")
    }

    // Cập nhật các trường được cung cấp trong newUser
    await userDetail.update({
      phone: newUser.phone || userDetail.phone,
      firstName: newUser.firstName || userDetail.firstName,
      lastName: newUser.lastName || userDetail.lastName,
      dob: newUser.dob || userDetail.dob,
      gender: newUser.gender || userDetail.gender,
      avatarUrl: newUser.avatarUrl || userDetail.avatarUrl
    })

    return userDetail
  } catch (error) {
    console.error(error)
    throw error
  }
} // Update user

async function deleteUser(id: string) {
  try {
    const user = await User.findOne({ where: { id, isDeleted: false } })
    if (!user) {
      throw responseStatus.responseNotFound404("User not found or already deleted")
    }

    const userDetail = await UserDetail.findOne({ where: { userId: id, isDeleted: false } })
    if (!userDetail) {
      throw responseStatus.responseNotFound404("User detail not found or already deleted")
    }

    const userResult = await User.update({ isDeleted: true }, { where: { id } })
    const userDetailResult = await UserDetail.update({ isDeleted: true }, { where: { userId: id } })

    if (userResult[0] === 0) {
      throw responseStatus.responeCustom(400, "Delete user failed")
    }
    if (userDetailResult[0] === 0) {
      throw responseStatus.responeCustom(400, "Delete user detail failed")
    }

    return
  } catch (error) {
    console.error(error)
    throw error
  }
} // Delete user

async function uploadAvatarUser(user: UpdateUserAvatar) {
  try {
    const result = await UserDetail.update(
      {
        avatarUrl: user.avatarUrl
      },
      {
        where: { userId: user.userId }
      }
    )
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
} // Update avatar user

export default {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  uploadAvatarUser
}
