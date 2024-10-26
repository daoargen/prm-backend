"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePagination = calculatePagination;
function calculatePagination(count, pageSize, pageIndex, maxPageSizeLimit = 100 // Số lượng item tối đa trên mỗi trang, mặc định không nhập là 100
) {
    if (pageSize > maxPageSizeLimit)
        pageSize = maxPageSizeLimit;
    // Tính toán thông tin phân trang
    const totalPage = Math.ceil(count / pageSize);
    const pagination = {
        pageSize, // Số lượng item trên mỗi trang
        totalItem: count, // Tổng số item
        currentPage: pageIndex, // Trang hiện tại
        maxPageSize: maxPageSizeLimit, // Số lượng item tối đa trên mỗi trang
        totalPage // Tổng số trang
    };
    return pagination;
}
