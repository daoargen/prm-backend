"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_config_1 = __importDefault(require("../configs/s3.config"));
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
const bucketName = process.env.AWS_S3_BUCKET;
const bucketRegion = process.env.AWS_REGION;
async function uploadImage(files) {
    try {
        // Kiểm tra nếu không có file nào được upload
        if (!files || (Array.isArray(files) && files.length === 0)) {
            throw responseStatus_1.default.responseBadRequest400("No file uploaded");
        }
        // Helper function để upload một file duy nhất
        const uploadSingleFile = async (file) => {
            const tmp = await isImageFile(file);
            if (!tmp) {
                throw responseStatus_1.default.responseBadRequest400("File is not an image");
            }
            // Tạo tên file với UUID để tránh trùng lặp
            const uniqueId = (0, uuid_1.v4)();
            const fileName = `image_${uniqueId}_${file.mimetype.split("/")[1]}_s3`;
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
            await s3_config_1.default.send(new client_s3_1.PutObjectCommand(params));
            return imageUrl;
        };
        // Nếu chỉ là một file, xử lý như trước và trả về URL duy nhất
        if (!Array.isArray(files)) {
            return await uploadSingleFile(files);
        }
        // Nếu là nhiều file, xử lý từng file và trả về mảng các URL
        const urls = await Promise.all(files.map((file) => uploadSingleFile(file)));
        return urls;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Upload image to S3 bucket
async function uploadFile(file) {
    try {
        if (!file) {
            throw responseStatus_1.default.responseBadRequest400("No file uploaded");
        }
        const uniqueId = (0, uuid_1.v4)();
        const fileName = `file_${uniqueId}_${file.mimetype.split("/")[1]}_s3`;
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        const fileUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        await s3_config_1.default.send(new client_s3_1.PutObjectCommand(params));
        return fileUrl;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Upload file to S3 bucket
async function deleteFile(fileName) {
    try {
        // Check if the file exists
        const headParams = {
            Bucket: bucketName,
            Key: fileName
        };
        // If the file does not exist, HeadObjectCommand will throw an error
        await s3_config_1.default.send(new client_s3_1.HeadObjectCommand(headParams));
        const params = {
            Bucket: bucketName,
            Key: fileName
        };
        await s3_config_1.default.send(new client_s3_1.DeleteObjectCommand(params));
        return "Delete file successfully";
    }
    catch (error) {
        if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
            throw responseStatus_1.default.responseNotFound404("File name not found");
        }
        else {
            (0, logNonCustomError_util_1.logNonCustomError)(error);
            throw error;
        }
    }
} // Delete any file by file name from S3 bucket
async function isImageFile(file) {
    const fileName = file.originalname;
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    return (fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "png" ||
        fileExtension === "gif" ||
        fileExtension === "bmp" ||
        fileExtension === "tiff" ||
        fileExtension === "webp" ||
        fileExtension === "svg");
} // Check file is good format
exports.default = {
    uploadImage,
    uploadFile,
    deleteFile
};
