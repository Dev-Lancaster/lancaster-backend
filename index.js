const app = require("./server");
const product = require("./api/product");

require("./startup/db")();

app.use("/api/product", product);

const PORT = process.env.PORT || 1984;
const server = app.listen(PORT);

module.exports = server;
