const mongoose = require("mongoose");
const CategoriaService = require("../../services/ecommerce/categoriaService");
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

  it("save 1", async () => {
    const model = null;
    const result = await CategoriaService.save(model);
    expect(result.message).toBe("Los datos de la categoría estan vacios");
  });

  it("save 2", async () => {
    const model = {
      activo: true,
      usuarioCrea: "wjuarez",
    };
    const result = await CategoriaService.save(model);
    expect(result.message).toBe("El nombre de la categoría esta vacio");
  });

  it("save 3", async () => {
    const model = {
      activo: true,
      nombre: "wjuarez",
    };
    const result = await CategoriaService.save(model);
    expect(result.message).toBe(
      "El nombre del usuario que crea la categoría esta vacio"
    );
  });

  it("save 4", async () => {
    const model = {
      nombre: "Masculino",
      activo: true,
      usuarioCrea: "wjuarez",
    };
    const result = await CategoriaService.save(model);
    //console.log(result.model);
    expect(result.type).toBe("SUCCESS");
  });

  it("findAll", async () => {
    const result = await CategoriaService.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it("findActive", async () => {
    const result = await CategoriaService.findActive();
    expect(result.length).toBeGreaterThan(0);
  });
});
