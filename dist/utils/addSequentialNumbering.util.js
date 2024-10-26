"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSequentialNumbering = addSequentialNumbering;
function addSequentialNumbering(items, prefix) {
    return items.map((item, index) => {
        const count = (index + 1).toString().padStart(3, "0"); // Định dạng số thứ tự
        const stt = `${prefix}${count}`; // Tạo trường stt
        return { ...item, stt }; // Thêm trường stt vào item
    });
}
