import { Op } from "sequelize"

import { Category } from "~/models/category.model"
import { Element } from "~/models/element.model"
import { FishImageUrl } from "~/models/fishImageUrl.model"
import { FishReview } from "~/models/fishReview.model"
import { KoiFish } from "~/models/koiFish.model"
import { KoiFishElement } from "~/models/koiFishElement.model"
import { Product } from "~/models/product.model"
import { ProductCategory } from "~/models/productCategory.model"
import { ProductImageUrl } from "~/models/productImageUrl.model"
import { ProductReview } from "~/models/productReview.model"
import { Variety } from "~/models/variety.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getMixedData(keyword: string) {
  try {
    const products = await Product.findAll({
      where: keyword
        ? {
            [Op.or]: [
              { id: { [Op.like]: `%${keyword}%` } },
              { name: { [Op.like]: `%${keyword}%` } },
              { description: { [Op.like]: `%${keyword}%` } }
            ],
            isDeleted: false
          }
        : {
            isDeleted: false
          },
      order: [["createdAt", "DESC"]]
    })

    const koiFishes = await KoiFish.findAll({
      where: keyword
        ? {
            [Op.or]: [
              { id: { [Op.like]: `%${keyword}%` } },
              { name: { [Op.like]: `%${keyword}%` } },
              { description: { [Op.like]: `%${keyword}%` } }
            ],
            isDeleted: false
          }
        : {
            isDeleted: false
          },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Variety,
          as: "variety",
          attributes: ["name", "description"]
        }
      ]
    })

    const combinedData = [...products, ...koiFishes]

    combinedData.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })

    // Xử lý dữ liệu Product và KoiFish
    const processedData = await Promise.all(
      combinedData.map(async (item) => {
        if (item.constructor.name === "Product") {
          // Xử lý Product
          const relatedProductCategories = await ProductCategory.findAll({
            where: { productId: item.id, isDeleted: false },
            attributes: ["productId", "categoryId"]
          })
          const categoryIds = relatedProductCategories
            .map((productCategory) => productCategory.categoryId)
            .filter((categoryId): categoryId is string => categoryId !== undefined)
          const categories = await Category.findAll({
            where: { id: categoryIds, isDeleted: false },
            attributes: ["id", "name", "description"]
          })
          const relatedImageUrls = await ProductImageUrl.findAll({
            where: { productId: item.id, isDeleted: false },
            attributes: ["id", "productId", "imageUrl"]
          })
          const relatedProductReview = await ProductReview.findAll({
            where: { productId: item.id, isDeleted: false },
            attributes: ["id", "productId", "rating"]
          })
          let averageRating = 0
          if (relatedProductReview.length > 0) {
            let totalRating = 0
            relatedProductReview.forEach((review) => {
              totalRating += review.rating
            })
            averageRating = totalRating / relatedProductReview.length
          }
          return {
            ...item.toJSON(),
            type: "PRODUCT",
            averageRating: averageRating,
            categories: categories,
            imageUrls: relatedImageUrls
          }
        } else if (item.constructor.name === "KoiFish") {
          // Xử lý KoiFish
          const relatedKoiFishElements = await KoiFishElement.findAll({
            where: { koiFishId: item.id, isDeleted: false },
            attributes: ["koiFishId", "elementId"]
          })
          const elementIds = relatedKoiFishElements
            .map((koiFishElement) => koiFishElement.elementId)
            .filter((elementId): elementId is string => elementId !== undefined)
          const elements = await Element.findAll({
            where: { id: elementIds, isDeleted: false },
            attributes: ["id", "name", "imageUrl"]
          })
          const relatedImageUrls = await FishImageUrl.findAll({
            where: { koiFishId: item.id, isDeleted: false },
            attributes: ["id", "koiFishId", "imageUrl"]
          })
          const relatedFishReview = await FishReview.findAll({
            where: { koiFishId: item.id, isDeleted: false },
            attributes: ["id", "koiFishId", "rating"]
          })
          let averageRating = 0
          if (relatedFishReview.length > 0) {
            let totalRating = 0
            relatedFishReview.forEach((review) => {
              totalRating += review.rating
            })
            averageRating = totalRating / relatedFishReview.length
          }
          return {
            ...item.toJSON(),
            type: "KOIFISH",
            averageRating: averageRating,
            elements: elements,
            imageUrls: relatedImageUrls
          }
        }
      })
    )

    const totalDataCount = combinedData.length
    const pagination = calculatePagination(totalDataCount, totalDataCount, 1)

    return { mixedData: processedData, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default { getMixedData }
