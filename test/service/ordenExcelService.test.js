const mongoose = require("mongoose");
const ordenExcelService = require("../../services/ecommerce/ordenExcelService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Prueba de Orden Excel Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  it("findOrden", async () => {
    const result = await ordenExcelService.generateResumen(12, 2022);
    console.log(result);
    expect(true).toBe(true);
  });
});
