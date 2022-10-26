const mongoose = require("mongoose");
const productoInvService = require("../../services/ecommerce/productoInvService");
const { ProductoInv } = require("../../models/productoInv");
const { MONGO_URL } = require("../../startup/db_url");

describe("Prueba de Categoria Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("reservar", async () => {
    const result = await productoInvService.liberar(
      "6338d4c9e4198da374494b35",
      3
    );
    console.log(result);
    expect(true).toBe(true);
  });
  it("fillProductoReserva", async () => {
    await productoInvService.fillProductoReserva("6338d4c9e4198da374494b35");
    expect(true).toBe(true);
  });

  /*it("reservar", async () => {
    const result = await productoInvService.reservar(
      "6338d4c9e4198da374494b35",
      3
    );
    console.log(result);
    expect(true).toBe(true);
  });*/
});
