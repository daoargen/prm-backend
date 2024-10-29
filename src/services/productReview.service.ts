import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateProduct, CreateProductReview, UpdateProduct, UpdateProductReview } from "~/constants/type"
import { ProductReview, ProductReviewInstance } from "~/models/productReview.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getProductReviews(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: productReviews } = await ProductReview.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = productReviews.map((productReview) => formatModelDate(productReview.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { productReviews: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getProductReviewById(id: string) {
  try {
    const productReview = await ProductReview.findOne({ where: { id, isDeleted: false } })
    if (!productReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá sản phẩm")
    }
    return productReview
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createProductReview(newProductReview: CreateProductReview) {
  try {
    const createdProductReview = await ProductReview.create({
      phoneNumber: newProductReview.phoneNumber,
      productId: newProductReview.productId,
      content: newProductReview.content
    })
    return createdProductReview
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateProductReview(id: string, updatedProductReview: UpdateProductReview) {
  try {
    const productReview = await ProductReview.findOne({ where: { id, isDeleted: false } })
    if (!productReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá sản phẩm")
    }

    productReview.phoneNumber = updatedProductReview.phoneNumber || productReview.phoneNumber
    productReview.productId = updatedProductReview.productId || productReview.productId
    productReview.content = updatedProductReview.content || productReview.content

    await productReview.save()
    return "Cập nhật đánh giá sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteProductReview(id: string) {
  try {
    const productReview = await ProductReview.findOne({ where: { id, isDeleted: false } })
    if (!productReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá sản phẩm")
    }

    productReview.isDeleted = true
    await productReview.save()

    return "Xóa đánh giá sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getProductReviews,
  getProductReviewById,
  createProductReview,
  updateProductReview,
  deleteProductReview
}
