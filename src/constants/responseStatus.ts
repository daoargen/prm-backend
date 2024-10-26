import { Pagination } from "./type"

const Response = (statusCode: number, message: string) => {
  return { timestamp: new Date().toISOString(), statusCode, message }
}

function responeCustom(statusCode: number, message: string) {
  return Response(statusCode, message)
} // Dùng cho trường hợp cần trả về status code khác

function responseMessage200(message: string) {
  return Response(200, message)
} // Dùng cho việc ghi chú message

function responseData200(message: string, data: any, pagination?: Pagination) {
  const goodResponse = Response(200, message)
  return {
    ...goodResponse,
    data: data,
    pagination: pagination
  }
} // Dùng cho GET; Trả về dữ liệu có paging

function responseCreateSuccess201(message = "Create successfully", data: any) {
  const respone = Response(201, message)
  return {
    ...respone,
    data: data
  }
} // Dùng cho POST; Trả về dữ liệu đã tạo

function responseSuccessImplement204(message = "Successful implementation") {
  return Response(204, message)
} // Dùng cho DELETE, PUT; Trả thành công không cần content

function responseBadRequest400(message = "Invalid request") {
  return Response(400, message)
} // Dùng cho request không hợp lệ, chẳng hạn như thiếu trường bắt buộc hoặc định dạng dữ liệu không hợp lệ.

function responseUnauthorized401(message = "Unauthorized") {
  return Response(401, message)
} // Dùng cho request cần xác thực

function responseForbidden403(message = "User does not have permission") {
  return Response(403, message)
} // Dùng cho request không có quyền

function responseNotFound404(message = "Not found") {
  return Response(404, message)
} // Dùng cho request không tìm thấy

function responseConflict409(message = "Already exist") {
  return Response(409, message)
} // Dùng cho request trùng lặp

function responseInternalError500(message = "Internal server error") {
  return Response(500, message)
} // Dùng cho lỗi server, dùng chung cho những lỗi không được phân loại

const invalidFieldResquest = (errorMessage: string, data: any) => {
  const invalidResponse = Response(400, errorMessage)
  return {
    ...invalidResponse,
    data: data
  }
} // Dùng cho validate field

export default {
  responeCustom,
  responseMessage200,
  responseData200,
  responseCreateSuccess201,
  responseSuccessImplement204,
  responseBadRequest400,
  responseUnauthorized401,
  responseForbidden403,
  responseNotFound404,
  responseConflict409,
  responseInternalError500,
  invalidFieldResquest
}
