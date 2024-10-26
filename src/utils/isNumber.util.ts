export const isNumber = (v: any) => {
  // Kiểm tra nếu v là số hoặc chuỗi đại diện cho số
  if (typeof v === "number") {
    return true // v là một số
  }

  if (typeof v === "string") {
    // Chuyển đổi chuỗi thành số và kiểm tra tính hợp lệ
    const num = +v
    return Number.isFinite(num) && v.trim() !== ""
  }

  return false // v không phải là số hoặc chuỗi hợp lệ
}
