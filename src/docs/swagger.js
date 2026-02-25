const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NBFC API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Address: {
          type: "object",
          properties: {
            houseNo: { type: "string" },
            area: { type: "string" },
            rural: { type: "string" },
            country: { type: "string", default: "India" },
            state: { type: "string" },
            district: { type: "string" },
            mandal: { type: "string" },
            city: { type: "string" },
            landmark: { type: "string" },
            ruralArea: { type: "string" },
            cityArea: { type: "string" },
            pincode: { type: "string" }
          }
        }
      }
    },
  },
  apis: ["./src/modules/**/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;