import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateOrder, CreateOrderDetail, UpdateOrder } from "~/constants/type"
import { FishImageUrl } from "~/models/fishImageUrl.model"
import { KoiFish } from "~/models/koiFish.model"
import { Order, OrderInstance } from "~/models/order.model"
import { OrderDetail } from "~/models/orderDetail.model"
import { Payment } from "~/models/payment.model"
import { Product } from "~/models/product.model"
import { ProductImageUrl } from "~/models/productImageUrl.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { validatePhoneNumber } from "~/utils/isPhoneNumber.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import { createPayment } from "./../constants/type"
import koiFishService from "./koiFish.service"
import orderDetailService from "./orderDetail.service"
import paymentService from "./payment.service"
import productService from "./product.service"

async function getOrders(pageIndex: number, pageSize: number, keyword: string, status: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      // Kiểm tra xem keyword có phải là ID hợp lệ không
      if (await checkOrderId(keyword)) {
        whereCondition[Op.or] = [{ id: { [Op.like]: `%${keyword}%` } }]
      } else if (validatePhoneNumber(keyword)) {
        // Nếu không phải ID, kiểm tra xem có phải số điện thoại hợp lệ không
        whereCondition[Op.or] = [{ phoneNumber: { [Op.like]: `%${keyword}%` } }]
      } else {
        // Nếu không phải ID và không phải số điện thoại hợp lệ
        return {
          orders: [],
          pagination: { pageSize: 10, totalItem: 0, currentPage: 1, maxPageSize: 100, totalPage: 0 }
        } // Trả về mảng rỗng
      }
    } else {
      return {
        orders: [],
        pagination: { pageSize: 10, totalItem: 0, currentPage: 1, maxPageSize: 100, totalPage: 0 }
      }
    }

    if (status && status.trim() !== "") {
      const inputStatus = status.trim().toUpperCase()
      whereCondition.status = inputStatus
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
      const relativeKoiFishImageUrls = await FishImageUrl.findAll({
        where: { koiFishId: koiFishIds, isDeleted: false },
        attributes: ["id", "koiFishId", "imageUrl"]
      })
      const relativeProductImageUrls = await ProductImageUrl.findAll({
        where: { productId: productIds, isDeleted: false },
        attributes: ["id", "productId", "imageUrl"]
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
            const koiFishImageUrls = relativeKoiFishImageUrls.filter((ki) => ki.koiFishId === koiFish?.id)
            return {
              ...orderDetail.toJSON(),
              koiFish: {
                ...koiFish?.toJSON(),
                imageUrls: koiFishImageUrls
              },
              product: null
            }
          } else if (orderDetail.type === "PRODUCT") {
            const product = products.find((p) => p.id === orderDetail.productId)
            const productImageUrls = relativeProductImageUrls.filter((pi) => pi.productId === product?.id)
            return {
              ...orderDetail.toJSON(),
              koifish: null,
              product: {
                ...product?.toJSON(),
                imageUrls: productImageUrls
              }
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
    const payment = await Payment.findOne({
      where: { orderId: order.id, isDeleted: false },
      attributes: ["id", "orderId", "paymentCode", "payMethod", "payStatus"]
    })
    const orderDetails = await OrderDetail.findAll({
      where: { orderId: id, isDeleted: false },
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

    // Sử dụng Promise.all để chờ tất cả các Promise hoàn thành
    const formatOrderDetail = await Promise.all(
      orderDetails.map(async (orderDetail) => {
        if (orderDetail.type === "KOIFISH") {
          const koiFish = koiFishs.find((k) => k.id === orderDetail.koiFishId)
          const fishImageUrls = await FishImageUrl.findAll({
            where: { koiFishId: koiFish?.id, isDeleted: false },
            attributes: ["id", "koiFishId", "imageUrl"]
          })
          return {
            ...orderDetail.toJSON(),
            koiFish: {
              ...koiFish?.toJSON(),
              imageUrls: fishImageUrls
            },
            product: null
          }
        } else if (orderDetail.type === "PRODUCT") {
          const product = products.find((p) => p.id === orderDetail.productId)
          const productImageUrls = await ProductImageUrl.findAll({
            where: { productId: product?.id, isDeleted: false },
            attributes: ["id", "productId", "imageUrl"]
          })
          return {
            ...orderDetail.toJSON(),
            koifish: null,
            product: {
              ...product?.toJSON(),
              imageUrls: productImageUrls
            }
          }
        }
      })
    )

    // Trả về kết quả sau khi xử lý
    return {
      ...order.toJSON(),
      formatOrderDetail: formatOrderDetail,
      payment: payment ? payment.toJSON() : null
    }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createOrder(newOrder: CreateOrder) {
  try {
    // Các kiểm tra ban đầu
    if (!validatePhoneNumber(newOrder.phoneNumber)) {
      throw responseStatus.responseBadRequest400("Số điện thoại không hợp lệ.")
    }
    if (newOrder.shippingMethod.toLowerCase() !== "normal" && newOrder.shippingMethod.toLowerCase() !== "fast") {
      throw responseStatus.responseBadRequest400(
        "Phương thức vận chuyển không hợp lệ. Chỉ chấp nhận 'normal' hoặc 'fast'."
      )
    }

    // Kiểm tra từng orderDetail
    for (const orderDetail of newOrder.orderDetails) {
      if (orderDetail.type !== "KOIFISH" && orderDetail.type !== "PRODUCT") {
        throw responseStatus.responseBadRequest400(
          "Loại sản phẩm không hợp lệ. Chỉ chấp nhận 'KOIFISH' hoặc 'PRODUCT'."
        )
      }

      if (orderDetail.type === "KOIFISH" && !orderDetail.koiFishId) {
        throw responseStatus.responseBadRequest400("Thiếu koiFishId cho sản phẩm loại KOIFISH.")
      }

      if (orderDetail.type === "KOIFISH" && orderDetail.koiFishId) {
        const koiFish = await KoiFish.findOne({ where: { id: orderDetail.koiFishId, isSold: true, isDeleted: false } })
        if (koiFish) {
          throw responseStatus.responseBadRequest400("Cá Koi đã bán")
        }
      }

      if (orderDetail.type === "PRODUCT" && !orderDetail.productId) {
        throw responseStatus.responseBadRequest400("Thiếu productId cho sản phẩm loại PRODUCT.")
      }
    }

    const createdOrder = await Order.create({
      phoneNumber: newOrder.phoneNumber,
      email: newOrder.email,
      address: newOrder.address,
      shippingMethod: newOrder.shippingMethod,
      status: "PENDING",
      totalAmount: 0
    })

    if (!createdOrder.id) {
      throw responseStatus.responseBadRequest400("Tạo hoá đơn thất bại")
    }

    // Tính toán tổng tiền
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

    // Phí vận chuyển
    totalAmount += createdOrder.shippingMethod.toLowerCase() === "normal" ? 30000 : 0
    totalAmount += createdOrder.shippingMethod.toLowerCase() === "fast" ? 50000 : 0
    createdOrder.totalAmount = totalAmount

    await createdOrder.save()

    // Tạo payment
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

async function comfirmOrder(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }

    const orderDetails = await OrderDetail.findAll({
      where: { orderId: id, isDeleted: false },
      attributes: ["id", "orderId", "koiFishId", "productId", "type", "quantity", "unitPrice", "totalPrice"]
    })

    const koiFishIds = orderDetails
      .map((orderDetail) => orderDetail.koiFishId)
      .filter((koiFishId): koiFishId is string => koiFishId !== undefined)

    const koiFishs = await KoiFish.findAll({
      where: { id: koiFishIds, isSold: true, isDeleted: false },
      attributes: ["id", "name", "description", "size", "gender", "isSold", "price"]
    })

    if (koiFishs.length > 0) {
      throw responseStatus.responseBadRequest400("Đơn hàng có cá đã bán")
    }

    const payment = await Payment.findOne({
      where: { orderId: id, isDeleted: false },
      attributes: ["id", "orderId", "paymentCode", "payMethod", "payStatus"]
    })

    if (payment?.payMethod === "COD") {
      order.status = "TRANSIT"
      await order.save()
    }

    return "Xác nhận đơn hàng thành công"
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

async function checkOrderId(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      return false
    }
    return true
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
  deleteOrder,
  comfirmOrder,
  checkOrderId
}
