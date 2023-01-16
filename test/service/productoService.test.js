const mongoose = require("mongoose");
const productoService = require("../../services/ecommerce/productoService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Prueba de Producto Service", () => {
  jest.setTimeout(100000000);
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("updateExcelInfo", async () => {
    await productoService.updateExcelInfo(
      "/Users/wjuarez/Desktop/Productos Web.xlsx"
    );
    expect(true).toBe(true);
  });
});
