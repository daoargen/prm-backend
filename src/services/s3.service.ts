import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

import s3 from "~/configs/s3.config"
import responseStatus from "~/constants/responseStatus"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

const bucketName = process.env.AWS_S3_BUCKET
const bucketRegion = process.env.AWS_REGION

async function uploadImage(files: Express.Multer.File | Express.Multer.File[]): Promise<string | string[]> {
  try {
    // Kiểm tra nếu không có file nào được upload
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw responseStatus.responseBadRequest400("No file uploaded")
    }

    // Helper function để upload một file duy nhất
    const uploadSingleFile = async (file: Express.Multer.File): Promise<string> => {
      const tmp = await isImageFile(file)
      if (!tmp) {
        throw responseStatus.responseBadRequest400("File is not an image")
      }

      // Tạo tên file với UUID để tránh trùng lặp
      const uniqueId = uuidv4()
      const fileName = `image_${uniqueId}_${file.mimetype.split("/")[1]}_s3`

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      }

      const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`
      await s3.send(new PutObjectCommand(params))

      return imageUrl
    }

    // Nếu chỉ là một file, xử lý như trước và trả về URL duy nhất
    if (!Array.isArray(files)) {
      return await uploadSingleFile(files)
    }

    // Nếu là nhiều file, xử lý từng file và trả về mảng các URL
    const urls = await Promise.all(files.map((file) => uploadSingleFile(file)))
    return urls
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Upload image to S3 bucket

async function uploadFile(file: Express.Multer.File): Promise<string> {
  try {
    if (!file) {
      throw responseStatus.responseBadRequest400("No file uploaded")
    }

    const uniqueId = uuidv4()
    const fileName = `file_${uniqueId}_${file.mimetype.split("/")[1]}_s3`

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    }
    const fileUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`
    await s3.send(new PutObjectCommand(params))

    return fileUrl
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Upload file to S3 bucket

async function deleteFile(fileName: string): Promise<string> {
  try {
    // Check if the file exists
    const headParams = {
      Bucket: bucketName,
      Key: fileName
    }

    // If the file does not exist, HeadObjectCommand will throw an error
    await s3.send(new HeadObjectCommand(headParams))

    const params = {
      Bucket: bucketName,
      Key: fileName
    }

    await s3.send(new DeleteObjectCommand(params))

    return "Delete file successfully"
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw responseStatus.responseNotFound404("File name not found")
    } else {
      logNonCustomError(error)
      throw error
    }
  }
} // Delete any file by file name from S3 bucket

async function isImageFile(file: Express.Multer.File): Promise<boolean> {
  const fileName = file.originalname
  const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase()
  return (
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "png" ||
    fileExtension === "gif" ||
    fileExtension === "bmp" ||
    fileExtension === "tiff" ||
    fileExtension === "webp" ||
    fileExtension === "svg"
  )
} // Check file is good format

export default {
  uploadImage,
  uploadFile,
  deleteFile
}
