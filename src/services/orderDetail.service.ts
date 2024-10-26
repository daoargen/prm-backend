import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateOrderDetail, UpdateOrderDetail, UpdateUserDetail } from "~/constants/type"
import { OrderDetail, OrderDetailInstance } from "~/models/orderDetail.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getOrderDetails(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: orderDetails } = await OrderDetail.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = orderDetails.map((orderDetail) => formatModelDate(orderDetail.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { orderDetails: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getOrderDetailById(id: string) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }
    return orderDetail
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createOrderDetail(newOrderDetail: CreateOrderDetail) {
  try {
    const createdOrderDetail = await OrderDetail.create({
      orderId: newOrderDetail.orderId,
      koiFishId: newOrderDetail.koiFishId,
      productId: newOrderDetail.productId,
      type: newOrderDetail.type,
      unitPrice: newOrderDetail.unitPrice,
      totalPrice: newOrderDetail.totalPrice
    })
    return createdOrderDetail
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateOrderDetail(id: string, updatedOrderDetail: UpdateOrderDetail) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }

    orderDetail.orderId = updatedOrderDetail.orderId || orderDetail.orderId
    orderDetail.koiFishId = updatedOrderDetail.koiFishId || orderDetail.koiFishId
    orderDetail.productId = updatedOrderDetail.productId || orderDetail.productId
    orderDetail.type = updatedOrderDetail.type || orderDetail.type
    orderDetail.unitPrice = updatedOrderDetail.unitPrice || orderDetail.unitPrice
    orderDetail.totalPrice = updatedOrderDetail.totalPrice || orderDetail.totalPrice

    await orderDetail.save()
    return "Cập nhật chi tiết đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteOrderDetail(id: string) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }

    orderDetail.isDeleted = true
    await orderDetail.save()

    return "Xóa chi tiết đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail
}
