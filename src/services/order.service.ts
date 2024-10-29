import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateOrder, CreateOrderDetail, UpdateOrder } from "~/constants/type"
import { KoiFish } from "~/models/koiFish.model"
import { Order, OrderInstance } from "~/models/order.model"
import { OrderDetail } from "~/models/orderDetail.model"
import { Payment } from "~/models/payment.model"
import { Product } from "~/models/product.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { validatePhoneNumber } from "~/utils/isPhoneNumber.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import { createPayment } from "./../constants/type"
import koiFishService from "./koiFish.service"
import orderDetailService from "./orderDetail.service"
import paymentService from "./payment.service"
import productService from "./product.service"

async function getOrders(pageIndex: number, pageSize: number, keyword: string, phoneNumber: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [{ id: { [Op.like]: `%${keyword}%` } }]
    }
    if (phoneNumber) {
      whereCondition[Op.or] = [{ phoneNumber: { [Op.like]: `%${phoneNumber}%` } }]
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })
    let dataResponse: any[] = []
    if (orders.length > 0) {
      const orderIds = orders.map((order) => order.id).filter((id): id is string => id !== undefined)
      const orderDetails = await OrderDetail.findAll({
        where: { orderId: orderIds, isDeleted: false },
        attributes: ["id", "orderId", "koiFishId", "productId", "type", "quantity", "unitPrice", "totalPrice"]
      })
      const productIds = orderDetails
        .map((orderDetail) => orderDetail.productId)
        .filter((productId): productId is string => productId !== undefined)
      const products = await Product.findAll({
        where: { id: productIds, isDeleted: false },
        attributes: ["id", "name", "description", "stock", "price"]
      })

      const koiFishIds = orderDetails
        .map((orderDetail) => orderDetail.koiFishId)
        .filter((koiFishId): koiFishId is string => koiFishId !== undefined)
      const koiFishs = await KoiFish.findAll({
        where: { id: koiFishIds, isDeleted: false },
        attributes: ["id", "name", "description", "size", "gender", "isSold", "price"]
      })

      const payments = await Payment.findAll({
        where: { orderId: orderIds, isDeleted: false },
        attributes: ["id", "orderId", "paymentCode", "payMethod", "payStatus"]
      })

      const unFormatDateOrders = orders.map((order) => {
        const relatedOrderDetail = orderDetails.filter((od) => od.orderId === order.id)
        const formatOrderDetail = relatedOrderDetail.map((orderDetail) => {
          if (orderDetail.type === "KOIFISH") {
            const koiFish = koiFishs.find((k) => k.id === orderDetail.koiFishId)
            return {
              ...orderDetail.toJSON(),
              koiFish: koiFish,
              product: null
            }
          } else if (orderDetail.type === "PRODUCT") {
            const product = products.find((p) => p.id === orderDetail.productId)
            return {
              ...orderDetail.toJSON(),
              koifish: null,
              product: product
            }
          }
        })
        const payment = payments.find((p) => p.orderId === order.id)
        return {
          ...order.toJSON(),
          orderDetails: formatOrderDetail,
          payment: payment
        }
      })
      dataResponse = unFormatDateOrders.map((order) => formatModelDate(order))
    }
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { orders: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getOrderById(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }
    const payment = await Payment.findAll({
      where: { orderId: order.id, isDeleted: false },
      attributes: ["id", "orderId", "paymentCode", "payMethod", "payStatus"]
    })
    return {
      ...order.toJSON(),
      payment: payment
    }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createOrder(newOrder: CreateOrder) {
  try {
    validatePhoneNumber(newOrder.phoneNumber)
    const createdOrder = await Order.create({
      phoneNumber: newOrder.phoneNumber,
      status: "PENDING_CONFIRMATION",
      totalAmount: 0
    })
    if (!createdOrder.id) {
      throw responseStatus.responseBadRequest400("Tạo hoá đơn thất bại")
    }
    if (!createdOrder.id) {
      throw responseStatus.responseBadRequest400("Tạo hoá đơn thất bại")
    }

    // Duyệt qua từng orderDetail để kiểm tra
    newOrder.orderDetails.map((orderDetail) => {
      // Kiểm tra type
      if (orderDetail.type !== "KOIFISH" && orderDetail.type !== "PRODUCT") {
        throw responseStatus.responseBadRequest400(
          "Loại sản phẩm không hợp lệ. Chỉ chấp nhận 'KOIFISH' hoặc 'PRODUCT'."
        )
      }

      // Kiểm tra koiFishId nếu type là KOIFISH
      if (orderDetail.type === "KOIFISH" && !orderDetail.koiFishId) {
        throw responseStatus.responseBadRequest400("Thiếu koiFishId cho sản phẩm loại KOIFISH.")
      }

      // Kiểm tra productId nếu type là PRODUCT
      if (orderDetail.type === "PRODUCT" && !orderDetail.productId) {
        throw responseStatus.responseBadRequest400("Thiếu productId cho sản phẩm loại PRODUCT.")
      }
    })
    let totalAmount = 0
    await Promise.all(
      newOrder.orderDetails.map(async (orderDetail) => {
        const newOrderDetail: CreateOrderDetail = {
          koiFishId: orderDetail.koiFishId === "" ? null : orderDetail.koiFishId,
          productId: orderDetail.productId === "" ? null : orderDetail.productId,
          type: orderDetail.type,
          quantity: orderDetail.koiFishId ? 1 : orderDetail.quantity
        }
        const createdOrderDetail = await orderDetailService.createOrderDetail(createdOrder.id!, newOrderDetail)
        totalAmount += createdOrderDetail.totalPrice
      })
    )
    createdOrder.totalAmount = totalAmount
    await createdOrder.save()

    const newPayment: createPayment = {
      orderId: createdOrder.id,
      amount: createdOrder.totalAmount,
      payMethod: newOrder.payMethod
    }

    await paymentService.createPayment(newPayment)

    return await getOrderById(createdOrder.id)
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateOrder(id: string, updatedOrder: UpdateOrder) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }

    order.status = updatedOrder.status || order.status

    await order.save()
    return "Cập nhật đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteOrder(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }

    order.isDeleted = true
    await order.save()

    return "Xóa đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}
