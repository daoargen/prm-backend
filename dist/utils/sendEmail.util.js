"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});
async function sendEmail(toEmail, subject, content) {
    return new Promise((resolve, reject) => {
        const mail = {
            from: process.env.GMAIL_EMAIL,
            to: toEmail,
            subject: subject,
            html: content
        };
        transporter.sendMail(mail, (err) => {
            if (err) {
                console.error("Failed to send email:", err);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
