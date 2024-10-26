import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateProductCategory, UpdateProductCategory } from "~/constants/type"
import { ProductCategory, ProductCategoryInstance } from "~/models/productCategory.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getProductCategories(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: productCategories } = await ProductCategory.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = productCategories.map((productCategory) => formatModelDate(productCategory.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { productCategories: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getProductCategoryById(id: string) {
  try {
    const productCategory = await ProductCategory.findOne({ where: { id, isDeleted: false } })
    if (!productCategory) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục sản phẩm")
    }
    return productCategory
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createProductCategory(newProductCategory: CreateProductCategory) {
  try {
    const createdProductCategory = await ProductCategory.create({
      productId: newProductCategory.productId,
      categoryId: newProductCategory.categoryId
    })
    return createdProductCategory
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateProductCategory(id: string, updatedProductCategory: UpdateProductCategory) {
  try {
    const productCategory = await ProductCategory.findOne({ where: { id, isDeleted: false } })
    if (!productCategory) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục sản phẩm")
    }

    productCategory.productId = updatedProductCategory.productId || productCategory.productId
    productCategory.categoryId = updatedProductCategory.categoryId || productCategory.categoryId

    await productCategory.save()
    return "Cập nhật danh mục sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteProductCategory(id: string) {
  try {
    const productCategory = await ProductCategory.findOne({ where: { id, isDeleted: false } })
    if (!productCategory) {
      throw responseStatus.responseNotFound404("Không tìm thấy danh mục sản phẩm")
    }

    productCategory.isDeleted = true
    await productCategory.save()

    return "Xóa danh mục sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
}
