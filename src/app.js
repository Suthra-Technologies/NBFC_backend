const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./utils/logger");
const tenantMiddleware = require("./middlewares/tenant.middleware");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(tenantMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;