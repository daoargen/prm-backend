import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateProduct, UpdateProduct } from "~/constants/type"
import koiFishService from "~/services/koiFish.service"
import productService from "~/services/product.service"
import productKoifishService from "~/services/productKoifish.service"

async function getProducts(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string
    const type = (req.query.type as string) || ""
    const yob = parseInt(req.query.yob as string)
    const category = req.query.category as string

    if (type.toLowerCase() === "product") {
      const { products, pagination } = await productService.getProducts(pageIndex, pageSize, keyword, category)
      return res.json(responseStatus.responseData200("Get products successfully!", products, pagination))
    } else if (type.toLowerCase() === "koifish") {
      const { koiFishes, pagination } = await koiFishService.getKoiFishes(pageIndex, pageSize, keyword, yob)
      return res.json(responseStatus.responseData200("Get koi fish successfully!", koiFishes, pagination))
    } else {
      const { mixedData, pagination } = await productKoifishService.getMixedData(keyword)
      return res.json(responseStatus.responseData200("Get mix data successfully!", mixedData, pagination))
    }
  } catch (error) {
    return res.json(error)
  }
}

async function getProductById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    if (await productService.checkProductId(id)) {
      const dataResponse = await productService.getProductById(id)
      return res.json(responseStatus.responseData200("Get product successfully!", dataResponse))
    }
    if (await koiFishService.checkKoifishId(id)) {
      const dataResponse = await koiFishService.getKoiFishById(id)
      return res.json(responseStatus.responseData200("Get koi fish successfully!", dataResponse))
    }
  } catch (error) {
    return res.json(error)
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, stock, price, supplierId, categoryIds, imageUrls } = req.body
    if (!name || !price || !supplierId) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateProduct = {
      name,
      description,
      stock,
      price,
      supplierId,
      categoryIds,
      imageUrls
    }

    const dataResponse = await productService.createProduct(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create product successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { name, description, stock, price, supplierId } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateProduct = {
      name,
      description,
      stock,
      price,
      supplierId
    }
    const dataResponse = await productService.updateProduct(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await productService.deleteProduct(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
