import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
})

export async function sendEmail(toEmail: any, subject: any, content: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const mail = {
      from: process.env.GMAIL_EMAIL,
      to: toEmail,
      subject: subject,
      html: content
    }

    transporter.sendMail(mail, (err) => {
      if (err) {
        console.error("Failed to send email:", err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
