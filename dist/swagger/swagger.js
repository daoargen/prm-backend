"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocs = (app, PORT) => {
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
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use("/api", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
exports.default = swaggerDocs;
