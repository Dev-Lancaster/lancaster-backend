const mongoose = require("mongoose");
const tarifaService = require("../../services/ecommerce/tarifaService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Tarifa Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("findTarifas", async () => {
    const result = await tarifaService.findTarifas();
    console.log(result);
    expect(true).toBe(true);
  });
});
