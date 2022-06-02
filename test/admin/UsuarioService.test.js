const mongoose = require("mongoose");
const UsuarioService = require("../../services/admin/UsuarioService");
const { MONGO_URL } = require("../../startup/db_url");

describe("Prueba de Usuario Service", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("validatePassword 1", () => {
    const password = "Prueba#1";
    const result = UsuarioService.validatePassword(password);
    expect(result.type).toBe("SUCCESS");
  });
});
