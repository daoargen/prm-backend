import { Payment } from "~/models/payment.model"
export type Account = {
  id: string
  email: string
  username: string
  role: Role
}

export type JWTResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  account: Account
}

export enum Role {
  USER,
  ADMIN
}

export type Pagination = {
  pageSize: number
  totalItem: number
  currentPage: number
  maxPageSize: number
  totalPage: number
}

// User
export interface CreateUser {
  email: string
  username: string
  password: string
  gender: "MALE" | "FEMALE" | "OTHER"
  dob: Date
  role?: Role
}

export interface UpdateUserDetail {
  phone?: string
  firstName?: string
  lastName?: string
  dob?: Date
  gender?: "MALE" | "FEMALE" | "OTHER"
  avatarUrl?: string
}

export interface UpdateUserAvatar {
  userId: string
  avatarUrl: string
}

export interface FormattedModel {
  [key: string]: any
  createdAt?: string
  updatedAt?: string
}

export interface CreateVariety {
  name: string
  description: string | null
}

export interface UpdateVariety {
  name?: string
  description?: string | null
}

export interface CreateElement {
  name: string
  imageUrl: string
}

export interface UpdateElement {
  name?: string
  imageUrl?: string
}

export interface CreateKoiFish {
  varietyId: string
  name: string
  description: string | null
  gender: "MALE" | "FEMALE" | null
  isSold: boolean
  supplierId: string
  price: number
  size: number | null
  elementIds: string[]
  imageUrls: string[]
}

export interface UpdateKoiFish {
  varietyId?: string
  name?: string
  description?: string | null
  gender?: "MALE" | "FEMALE" | null
  isSold?: boolean
  supplierId?: string
  price?: number
  size?: number | null
}

export interface CreateKoiFishElement {
  koiFishId: string
  elementId: string
}

export interface UpdateKoiFishElement {
  koiFishId?: string
  elementId?: string
}

export interface CreateProduct {
  name: string
  description: string | null
  stock: number
  price: number
  supplierId: string
  categoryIds: string[]
  imageUrls: string[]
}

export interface UpdateProduct {
  name?: string
  description?: string | null
  stock?: number
  price?: number
  supplierId?: string
}

export interface CreateProductImageUrl {
  productId: string
  imageUrl: string
}

export interface UpdateProductImageUrl {
  productId?: string
  imageUrl?: string
}

export interface CreateCategory {
  name: string
  description: string | null
}

export interface UpdateCategory {
  name?: string
  description?: string | null
}

export interface CreateProductCategory {
  productId: string
  categoryId: string
}

export interface UpdateProductCategory {
  productId?: string
  categoryId?: string
}

export interface CreateOrder {
  phoneNumber: string
  payMethod: "CARD" | "COD"
  orderDetails: CreateOrderDetail[]
}

export interface UpdateOrder {
  phoneNumber?: string
  status?: "PENDING_CONFIRMATION" | "IN TRANSIT" | "COMPLETED" | "CANCEL"
  totalAmount?: number
}

export interface CreateOrderDetail {
  koiFishId: string | null
  productId: string | null
  type: string
  quantity: number
}

export interface UpdateOrderDetail {
  quantity?: number
}

export interface CreateProductReview {
  phoneNumber: string
  productId: string
  content: string
}

export interface UpdateProductReview {
  phoneNumber?: string
  productId?: string
  content?: string
}

export interface CreateFishReview {
  phoneNumber: string
  koiFishId: string
  content: string
}

export interface UpdateFishReview {
  phoneNumber?: string
  koiFishId?: string
  content?: string
}

export interface CreateFishImageUrl {
  koiFishId: string
  imageUrl: string
}

export interface UpdateFishImageUrl {
  koiFishId?: string
  imageUrl?: string
}

export interface CreateSupplier {
  name: string
  description?: string
  phoneNumber?: string
  email?: string
}

export interface UpdateSupplier {
  name?: string
  description?: string
  phoneNumber?: string
  email?: string
}

export interface createPayment {
  orderId: string
  amount: number
  payMethod: "CARD" | "COD"
}

export interface UpdatePayment {
  payStatus?: "PENDING" | "COMPLETED" | "CANCEL"
}

export interface handleSepayWebhook {
  content: string // Nội dung chuyển khoản
  transferAmount: number // Số tiền giao dịch
}
