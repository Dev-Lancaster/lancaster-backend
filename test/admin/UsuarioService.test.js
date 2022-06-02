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
    const password = "Prueba#&.1";
    const result = UsuarioService.validatePassword(password);
    expect(result.type).toBe("SUCCESS");
  });

  it("validatePassword 2", () => {
    const password = "prueba";
    const result = UsuarioService.validatePassword(password);
    expect(result.message).toBe(
      "La contraseña debe tener al menos un carácter especial"
    );
  });

  it("validatePassword 3", () => {
    const password = "";
    const result = UsuarioService.validatePassword(password);
    expect(result.message).toBe("La contraseña esta vacia");
  });

  it("validatePassword 4", () => {
    const password = "prueba#$";
    const result = UsuarioService.validatePassword(password);
    expect(result.message).toBe("La contraseña debe tener al menos un número");
  });

  it("validatePassword 5", () => {
    const password = "prueba#$12";
    const result = UsuarioService.validatePassword(password);
    expect(result.message).toBe(
      "La contraseña debe tener al menos una letra mayúscula"
    );
  });

  it("validatePassword 6", () => {
    const password = "prueba#$12OU";
    const result = UsuarioService.validatePassword(password);
    expect(result.type).toBe("SUCCESS");
  });

  it("createUser", async () => {
    const model = {
      user: "rmoreno",
      password: "Prueba1#",
      nombre: "RMORENO",
      correo: "rmoreno@lancaster.pe",
      activo: true,
      rol: "ADMIN",
    };
    const result = await UsuarioService.createUser(model);
    expect(result.message).toBe("El usuario ya existe");
  });

  it("findByCorreo", async () => {
    const correo = "rmoreno@lancaster.pe";
    const result = await UsuarioService.findByCorreo(correo);
    expect(result.nombre).toBe("RMORENO");
  });

  it("findById", async () => {
    const id = "62992595873562ae01f3a948";
    const result = await UsuarioService.findById(id);
    expect(result.nombre).toBe("RMORENO");
  });

  it("validateCredentials 1", async () => {
    const correo = "rmoreno@lancaster.pe";
    const password = "Prueba1#";
    const result = await UsuarioService.validateCredentials(correo, password);
    console.log(result);
    expect(result.type).toBe("SUCCESS");
  });
});
