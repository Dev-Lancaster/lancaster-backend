const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../server");
const { MONGO_URL } = require("../../../startup/db_url");
const url = "/auth";

describe("API auth", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("/ - login", async () => {
    const response = await request(app)
      .post(url + "/")
      .send({
        correo: "rmoreno@lancaster.pe",
        password: "Prueba1#",
      });
    expect(response.status).toBe(200);
  });

  it("/ - login 2", async () => {
    const response = await request(app)
      .post(url + "/")
      .send({
        correo: "rmoreno@lancaster.pe",
        password: "Prueba1#",
      });
    expect(response.body.type).toBe("SUCCESS");
  });

  it("/ - login 3", async () => {
    const response = await request(app)
      .post(url + "/")
      .send({
        correo: "rmoreno@lancaster.pe",
        password: "prueba1#",
      });
    expect(response.status).toBe(204);
  });
});
