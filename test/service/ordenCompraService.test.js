const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");
const { MONGO_URL } = require("../../startup/db_url");

const cliente = {
  firstname: "Prueba",
  lastname: "Prueba",
  dni: "Prueba",
  phone: "Prueba",
  email: "Prueba",
  address: "Prueba",
  country: "Prueba",
  town: "Prueba",
  state: "Prueba",
  postalcode: "Prueba",
};

const productos = [
  //12
  {
    producto: "6338d4c9e4198da374494b35",
    precio: 3.5,
    cantidad: 3,
  },
  //9
  {
    producto: "6338d4cae4198da374494b3b",
    precio: 4.5,
    cantidad: 2,
  },
  //7
  {
    producto: "6338d4cae4198da374494b41",
    precio: 5,
    cantidad: 1,
  },
];

let orden = {
  products: productos,
  customerDetails: cliente,
};

describe("Prueba de Categoria Service", () => {
  jest.setTimeout(1000000);
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  /*
  it("validateNubeFact", async () => {
    const result = await OrdenCompraService.getCodeNubeFact(100);
    console.log(result);
    expect(true).toBe(true);
  });
    it("generateOrdenado", async () => {
    const result = await OrdenCompraService.generateOrdenado(orden);
    console.log(result);
    expect(true).toBe(true);
  });
  it("generatePagado", async () => {
    orden.culquiToken = "CODIGO CULQUI";
    const result = await OrdenCompraService.generatePagado(
      "634339c7577502bab0c56ed2",
      orden
    );
    console.log(result);
    expect(true).toBe(true);
  });
  it("generateFacturado", async () => {
    orden.codigoFact = "CODIGO NUBE";
    const result = await OrdenCompraService.generateFacturado(
      "6341a20021a45f69683fa554",
      orden
    );
    console.log(result);
    expect(true).toBe(true);
  });*/
});
