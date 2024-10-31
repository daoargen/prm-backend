import { Express, Request, Response } from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const swaggerDocs = (app: Express, PORT: string) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Template typescript",
        version: "1.0.0"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization"
          }
        }
      },
      tags: [
        {
          name: "health",
          description: "Health check"
        },
        {
          name: "auth",
          description: "Authentication related endpoints"
        },
        {
          name: "user",
          description: "Operations about user"
        },
        {
          name: "prm",
          description: "Operations about using for prm"
        }
      ],
      security: [
        {
          bearerAuth: []
        }
      ],
      servers: [
        {
          url: `http://localhost:${PORT}`
        }
        // {
        //   url: `${process.env.DEPLOY_URL}`
        // }
      ]
    },
    apis: ["./src/routes/*.ts"]
  }

  const swaggerSpec = swaggerJSDoc(options)
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerSpec)
  })
}

export default swaggerDocs
