import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateOrder, UpdateOrder } from "~/constants/type"
import orderService from "~/services/order.service"

async function createOrder(req: Request, res: Response) {
  try {
    const { phoneNumber, payMethod, orderDetails } = req.body
    if (!phoneNumber || !payMethod || !orderDetails) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateOrder = {
      phoneNumber,
      payMethod,
      orderDetails
    }

    const dataResponse = await orderService.createOrder(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create order successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for creating a new order

async function editOrder(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { status } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateOrder = {
      status
    }

    const dataResponse = await orderService.updateOrder(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for editing an order

async function confirmOrder(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await orderService.comfirmOrder(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for editing an order

async function deleteOrder(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await orderService.deleteOrder(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for deleting an order

async function getOrders(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string
    const phoneNumber = req.query.phoneNumber as string

    const { orders, pagination } = await orderService.getOrders(pageIndex, pageSize, keyword, phoneNumber)
    return res.json(responseStatus.responseData200("Get orders successfully!", orders, pagination))
  } catch (error) {
    return res.json(error)
  }
} // Controller for getting orders

async function getOrderById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await orderService.getOrderById(id)
    return res.json(responseStatus.responseData200("Get order successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for getting order by id

export default {
  createOrder,
  editOrder,
  deleteOrder,
  getOrders,
  getOrderById,
  confirmOrder
}
