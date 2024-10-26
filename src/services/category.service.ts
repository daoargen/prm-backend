import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateCategory, UpdateCategory } from "~/constants/type"
import { Category, CategoryInstance } from "~/models/category.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getCategories(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition.name = { [Op.like]: `%${keyword}%` }
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = categories.map((category) => formatModelDate(category.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { categories: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getCategoryById(id: string) {
  try {
    const category = await Category.findOne({ where: { id, isDeleted: false } })
    if (!category) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục")
    }
    return category
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createCategory(newCategory: CreateCategory) {
  try {
    const createdCategory = await Category.create({
      name: newCategory.name,
      description: newCategory.description
    })
    return createdCategory
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateCategory(id: string, updatedCategory: UpdateCategory) {
  try {
    const category = await Category.findOne({ where: { id, isDeleted: false } })
    if (!category) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục")
    }
    category.name = updatedCategory.name || category.name
    category.description = updatedCategory.description || category.description

    await category.save()
    return "Cập nhật danh mục thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteCategory(id: string) {
  try {
    const category = await Category.findOne({ where: { id, isDeleted: false } })
    if (!category) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục")
    }

    category.isDeleted = true
    await category.save()

    return "Xóa danh mục thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
