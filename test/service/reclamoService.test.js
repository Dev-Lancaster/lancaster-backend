const mongoose = require("mongoose");
const reclamoService = require("../../services/ecommerce/reclamoService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Reclamo Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("sendEmail", async () => {
    await reclamoService.sendEmail();
    expect(true).toBe(true);
  });
});
