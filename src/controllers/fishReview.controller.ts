import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateFishReview } from "~/constants/type"
import fishReviewService from "~/services/fishReview.service"

async function createFishReview(req: Request, res: Response) {
  try {
    const { userId, koiFishId, content } = req.body
    if (!userId || !koiFishId || !content) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateFishReview = {
      userId,
      koiFishId,
      content
    }

    const dataResponse = await fishReviewService.createFishReview(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create fish review successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  createFishReview
}
