import { Category } from "~/models/category.model"
import { Element } from "~/models/element.model"
import { FishImageUrl } from "~/models/fishImageUrl.model"
import { FishReview } from "~/models/fishReview.model"
import { KoiFish } from "~/models/koiFish.model"
import { KoiFishElement } from "~/models/koiFishElement.model"
import { Order } from "~/models/order.model"
import { OrderDetail } from "~/models/orderDetail.model"
import { Payment } from "~/models/payment.model"
import { Product } from "~/models/product.model"
import { ProductCategory } from "~/models/productCategory.model"
import { ProductImageUrl } from "~/models/productImageUrl.model"
import { ProductReview } from "~/models/productReview.model"
import { Supplier } from "~/models/supplier.model"
import { User } from "~/models/user.model"
import { UserDetail } from "~/models/userDetail.model"
import { Variety } from "~/models/variety.model"

export async function syncModels() {
  try {
    // 1. Bảng độc lập
    await User.sync()
    console.log("User table created successfully!")

    await Variety.sync()
    console.log("Variety table created successfully!")

    await Element.sync()
    console.log("Element table created successfully!")

    await Supplier.sync()
    console.log("Supplier table created successfully!")

    await Category.sync()
    console.log("Category table created successfully!")

    await Product.sync()
    console.log("Product table created successfully!")

    // 2. Bảng phụ thuộc User
    await UserDetail.sync()
    console.log("UserDetail table created successfully!")

    // 3. Bảng phụ thuộc Variety and Supplier
    await KoiFish.sync()
    console.log("KoiFish table created successfully!")

    // 4. Bảng phụ thuộc KoiFish and Element
    await KoiFishElement.sync()
    console.log("KoiFishElement table created successfully!")

    // 5. Bảng phụ thuộc Product
    await ProductImageUrl.sync()
    console.log("ProductImageUrl table created successfully!")

    await ProductReview.sync()
    console.log("ProductReview table created successfully!")

    // 6. Bảng phụ thuộc Product and Category
    await ProductCategory.sync()
    console.log("ProductCategory table created successfully!")

    // 7. Bảng Order (độc lập)
    await Order.sync()
    console.log("Order table created successfully!")

    // 8. Bảng phụ thuộc Order
    await Payment.sync()
    console.log("Payment table created successfully!")

    await OrderDetail.sync()
    console.log("OrderDetail table created successfully!")

    // 9. Bảng phụ thuộc KoiFish
    await FishImageUrl.sync()
    console.log("FishImageUrl table created successfully!")

    await FishReview.sync()
    console.log("FishReview table created successfully!")

    console.log("Tables synchronized successfully.")
  } catch (error) {
    console.error("Error syncing tables:", error)
    throw error
  }
}
