import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateProductImageUrl, UpdateProductImageUrl } from "~/constants/type"
import { ProductImageUrl, ProductImageUrlInstance } from "~/models/productImageUrl.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getProductImageUrls(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: productImageUrls } = await ProductImageUrl.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = productImageUrls.map((productImageUrl) => formatModelDate(productImageUrl.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { productImageUrls: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getProductImageUrlById(id: string) {
  try {
    const productImageUrl = await ProductImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!productImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh sản phẩm")
    }
    return productImageUrl
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createProductImageUrl(newProductImageUrl: CreateProductImageUrl) {
  try {
    const createdProductImageUrl = await ProductImageUrl.create({
      productId: newProductImageUrl.productId,
      imageUrl: newProductImageUrl.imageUrl
    })
    return createdProductImageUrl
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateProductImageUrl(id: string, updatedProductImageUrl: UpdateProductImageUrl) {
  try {
    const productImageUrl = await ProductImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!productImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh sản phẩm")
    }

    productImageUrl.productId = updatedProductImageUrl.productId || productImageUrl.productId
    productImageUrl.imageUrl = updatedProductImageUrl.imageUrl || productImageUrl.imageUrl

    await productImageUrl.save()
    return "Cập nhật ảnh sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteProductImageUrl(id: string) {
  try {
    const productImageUrl = await ProductImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!productImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh sản phẩm")
    }

    productImageUrl.isDeleted = true
    await productImageUrl.save()

    return "Xóa ảnh sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getProductImageUrls,
  getProductImageUrlById,
  createProductImageUrl,
  updateProductImageUrl,
  deleteProductImageUrl
}
