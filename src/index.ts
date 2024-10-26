// ===== Imports =====
import "dotenv/config"

import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

import { overwriteResponseJSON } from "~/middlewares/overwriteResponseJSON.middleware"
import mainRouter from "~/routes/index"
import swaggerDocs from "~/swagger/swagger"

import { syncModels } from "./databases/syncModels"

const start = async () => {
  try {
    await syncModels()
    // ===== Config =====
    const app = express()
    const PORT = process.env.PORT || 3000

    // ===== Middlewares =====
    // app.use(
    //   cors({
    //     origin: process.env.CLIENT_URL,
    //     credentials: true
    //   })
    // )
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(overwriteResponseJSON)

    // ===== Routes =====
    // app.use('/', indexRouter)
    app.use("/api", mainRouter)

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`)
      console.log(`Swagger on ${process.env.SERVER_URL}/api`)
      swaggerDocs(app, String(PORT))
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
