const mongoose = require("mongoose");
const UserShopService = require("../../services/ecommerce/userShopService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Prueba de UserShop Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("save", async () => {
    const model = {
      firstname: "Prueba1",
      lastname: "Prueba1",
      dni: "Prueba1",
      phone: "Prueba1",
      email: "Prueba1",
      address: "Prueba1",
      country: "Prueba1",
      town: "Prueba1",
      state: "Prueba1",
      postalcode: "Prueba1",
      password: "Prueba1",
      dateCreation: new Date(),
    };
    const result = await UserShopService.save(model);
    console.log(result);
    expect(true).toBe(true);
  });
  it("findAll", async () => {
    const result = await UserShopService.findAll();
    console.log(result);
    expect(true).toBe(true);
  });
});
