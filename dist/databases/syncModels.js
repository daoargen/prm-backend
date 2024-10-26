"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncModels = syncModels;
const category_model_1 = require("../models/category.model");
const element_model_1 = require("../models/element.model");
const fishImageUrl_model_1 = require("../models/fishImageUrl.model");
const fishReview_model_1 = require("../models/fishReview.model");
const koiFish_model_1 = require("../models/koiFish.model");
const koiFishElement_model_1 = require("../models/koiFishElement.model");
const order_model_1 = require("../models/order.model");
const orderDetail_model_1 = require("../models/orderDetail.model");
const payment_model_1 = require("../models/payment.model");
const product_model_1 = require("../models/product.model");
const productCategory_model_1 = require("../models/productCategory.model");
const productImageUrl_model_1 = require("../models/productImageUrl.model");
const productReview_model_1 = require("../models/productReview.model");
const supplier_model_1 = require("../models/supplier.model");
const user_model_1 = require("../models/user.model");
const userDetail_model_1 = require("../models/userDetail.model");
const variety_model_1 = require("../models/variety.model");
async function syncModels() {
    try {
        // 1. Bảng độc lập
        await user_model_1.User.sync();
        console.log("User table created successfully!");
        await variety_model_1.Variety.sync();
        console.log("Variety table created successfully!");
        await element_model_1.Element.sync();
        console.log("Element table created successfully!");
        await supplier_model_1.Supplier.sync();
        console.log("Supplier table created successfully!");
        await category_model_1.Category.sync();
        console.log("Category table created successfully!");
        await product_model_1.Product.sync();
        console.log("Product table created successfully!");
        // 2. Bảng phụ thuộc User
        await userDetail_model_1.UserDetail.sync();
        console.log("UserDetail table created successfully!");
        // 3. Bảng phụ thuộc Variety and Supplier
        await koiFish_model_1.KoiFish.sync();
        console.log("KoiFish table created successfully!");
        // 4. Bảng phụ thuộc KoiFish and Element
        await koiFishElement_model_1.KoiFishElement.sync();
        console.log("KoiFishElement table created successfully!");
        // 5. Bảng phụ thuộc Product
        await productImageUrl_model_1.ProductImageUrl.sync();
        console.log("ProductImageUrl table created successfully!");
        await productReview_model_1.ProductReview.sync();
        console.log("ProductReview table created successfully!");
        // 6. Bảng phụ thuộc Product and Category
        await productCategory_model_1.ProductCategory.sync();
        console.log("ProductCategory table created successfully!");
        // 7. Bảng Order (độc lập)
        await order_model_1.Order.sync();
        console.log("Order table created successfully!");
        // 8. Bảng phụ thuộc Order
        await payment_model_1.Payment.sync();
        console.log("Payment table created successfully!");
        await orderDetail_model_1.OrderDetail.sync();
        console.log("OrderDetail table created successfully!");
        // 9. Bảng phụ thuộc KoiFish
        await fishImageUrl_model_1.FishImageUrl.sync();
        console.log("FishImageUrl table created successfully!");
        await fishReview_model_1.FishReview.sync();
        console.log("FishReview table created successfully!");
        console.log("Tables synchronized successfully.");
    }
    catch (error) {
        console.error("Error syncing tables:", error);
        throw error;
    }
}
