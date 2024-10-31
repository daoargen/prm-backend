import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateProduct, CreateProductCategory, CreateProductImageUrl, UpdateProduct } from "~/constants/type"
import { Category } from "~/models/category.model"
import { Product, ProductInstance } from "~/models/product.model"
import { ProductCategory } from "~/models/productCategory.model"
import { ProductImageUrl } from "~/models/productImageUrl.model"
import { ProductReview } from "~/models/productReview.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import productCategoryService from "./productCategory.service"
import productImageUrlService from "./productImageUrl.service"

async function getProducts(pageIndex: number, pageSize: number, keyword: string, category: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [
        { id: { [Op.like]: `%${keyword}%` } },
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    }
    if (category) {
      const currentCategory = await Category.findOne({
        where: { name: category, isDeleted: false },
        attributes: ["id", "name"]
      })
      if (!currentCategory) {
        throw responseStatus.responseNotFound404("Không tìm thấy category")
      }
      const productCategories = await ProductCategory.findAll({
        where: { categoryId: currentCategory.id, isDeleted: false },
        attributes: ["productId"]
      })

      const productIdsByCategory = productCategories
        .map((pc) => pc.productId)
        .filter((productId): productId is string => productId !== undefined)
      if (productIdsByCategory.length > 0) {
        whereCondition.id = { [Op.in]: productIdsByCategory }
      }
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    let dataResponse: any = []
    if (products.length > 0) {
      const productIds = products.map((product) => product.id).filter((id): id is string => id !== undefined)
      const productCategories = await ProductCategory.findAll({
        where: { productId: productIds, isDeleted: false },
        attributes: ["productId", "categoryId"]
      })
      const categoryIds = productCategories
        .map((productCategory) => productCategory.categoryId)
        .filter((categoryId): categoryId is string => categoryId !== undefined)
      const categories = await Category.findAll({
        where: { id: categoryIds, isDeleted: false },
        attributes: ["id", "name", "description"]
      })
      const imageUrls = await ProductImageUrl.findAll({
        where: { productId: productIds, isDeleted: false },
        attributes: ["id", "productId", "imageUrl"]
      })
      const formatProducts = products.map((product) => {
        const relatedProductCategories = productCategories.filter((kfe) => kfe.productId === product.id)
        const relatedCategories = relatedProductCategories.map((kfe) => {
          return categories.find((category) => category.id === kfe.categoryId)
        })
        const relatedImageUrls = imageUrls.filter((kfi) => kfi.productId === product.id).map((kfi) => kfi.imageUrl)
        return {
          ...product.toJSON(),
          type: "PRODUCT",
          categories: relatedCategories,
          imageUrls: relatedImageUrls
        }
      })
      dataResponse = formatProducts.map((product: any) => formatModelDate(product))
    }

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
    const productCategories = await ProductCategory.findAll({
      where: { productId: id, isDeleted: false },
      attributes: ["productId", "categoryId"]
    })
    const categoryIds = productCategories
      .map((productCategory) => productCategory.categoryId)
      .filter((categoryId): categoryId is string => categoryId !== undefined)
    const categories = await Category.findAll({
      where: { id: categoryIds, isDeleted: false },
      attributes: ["id", "name", "description"]
    })
    const imageUrls = await ProductImageUrl.findAll({
      where: { productId: id, isDeleted: false },
      attributes: ["id", "productId", "imageUrl"]
    })
    const productReviews = await ProductReview.findAll({
      where: { productId: id, isDeleted: false },
      attributes: ["phoneNumber", "content"]
    })
    return {
      ...product.toJSON(),
      categories: categories,
      imageUrls: imageUrls,
      productReviews: productReviews
    }
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
    if (!createdProduct.id) {
      throw responseStatus.responseBadRequest400("Tạo sản phẩm thất bại")
    } else {
      if (newProduct.categoryIds) {
        newProduct.categoryIds.map(async (categoryId) => {
          const newProductCategory: CreateProductCategory = {
            productId: createdProduct.id!,
            categoryId: categoryId
          }
          await productCategoryService.createProductCategory(newProductCategory)
        })
      }
      if (newProduct.imageUrls) {
        newProduct.imageUrls.map(async (imageUrl) => {
          const newProductImageUrl: CreateProductImageUrl = {
            productId: createdProduct.id!,
            imageUrl: imageUrl
          }
          await productImageUrlService.createProductImageUrl(newProductImageUrl)
        })
      }
    }
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

async function checkProductId(id: string) {
  try {
    const product = await Product.findOne({ where: { id, isDeleted: false } })
    if (!product) {
      return false
    }
    return true
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
  deleteProduct,
  checkProductId
}
