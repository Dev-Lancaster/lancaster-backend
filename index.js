const app = require("./server");
const swaggerUi = require("swagger-ui-express");
const product = require("./api/product");
const swaggerDocument = require("./swagger.json");

require("./startup/db")();
app.use("/api/product", product);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 1984;
const server = app.listen(PORT);

module.exports = server;
