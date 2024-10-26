interface WithStt {
  stt?: string
}

export function addSequentialNumbering<T extends WithStt>(items: T[], prefix: string): (T & WithStt)[] {
  return items.map((item, index) => {
    const count = (index + 1).toString().padStart(3, "0") // Định dạng số thứ tự
    const stt = `${prefix}${count}` // Tạo trường stt
    return { ...item, stt } // Thêm trường stt vào item
  })
}
