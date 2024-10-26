import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateProduct, UpdateProduct } from "~/constants/type"
import { Product, ProductInstance } from "~/models/product.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getProducts(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }]
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = products.map((product) => formatModelDate(product.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { products: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getProductById(id: string) {
  try {
    const product = await Product.findOne({ where: { id, isDeleted: false } })
    if (!product) {
      throw responseStatus.responseNotFound404("Không tìm thấy sản phẩm")
    }
    return product
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createProduct(newProduct: CreateProduct) {
  try {
    const createdProduct = await Product.create({
      name: newProduct.name,
      description: newProduct.description,
      stock: newProduct.stock,
      price: newProduct.price,
      supplierId: newProduct.supplierId
    })
    return createdProduct
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateProduct(id: string, updatedProduct: UpdateProduct) {
  try {
    const product = await Product.findOne({ where: { id, isDeleted: false } })
    if (!product) {
      throw responseStatus.responseNotFound404("Không tìm thấy sản phẩm")
    }

    product.name = updatedProduct.name || product.name
    product.description = updatedProduct.description || product.description
    product.stock = updatedProduct.stock || product.stock
    product.price = updatedProduct.price || product.price
    product.supplierId = updatedProduct.supplierId || product.supplierId

    await product.save()
    return "Cập nhật sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteProduct(id: string) {
  try {
    const product = await Product.findOne({ where: { id, isDeleted: false } })
    if (!product) {
      throw responseStatus.responseNotFound404("Không tìm thấy sản phẩm")
    }

    product.isDeleted = true
    await product.save()

    return "Xóa sản phẩm thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
