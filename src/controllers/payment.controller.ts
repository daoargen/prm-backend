import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { handleSepayWebhook } from "~/constants/type"
import paymentService from "~/services/payment.service"

async function completePaymentFromWebhook(req: Request, res: Response) {
  try {
    const { content, transferAmount } = req.body
    const dataRequest: handleSepayWebhook = {
      content,
      transferAmount
    }
    await paymentService.completePaymentFromWebhook(dataRequest)
    return res.json(responseStatus.responseMessage200("update complete payment successfully!"))
  } catch (error) {
    return res.json(error)
  }
}

async function cancelPayment(req: Request, res: Response) {
  try {
    const id = req.params.id
    await paymentService.cancelPayment(id)
    return res.json(responseStatus.responseMessage200("cancel payment successfully!"))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  completePaymentFromWebhook,
  cancelPayment
}
