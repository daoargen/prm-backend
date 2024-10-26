import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateProductReview } from "~/constants/type"
import productReviewService from "~/services/productReview.service"

async function createProductReview(req: Request, res: Response) {
  try {
    const { userId, productId, content } = req.body
    if (!userId || !productId || !content) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateProductReview = {
      userId,
      productId,
      content
    }

    const dataResponse = await productReviewService.createProductReview(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create product review successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  createProductReview
}
