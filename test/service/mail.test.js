const mail = require("../../middleware/mail");

describe("Mail middleware", () => {
  it("sendMail", async () => {
    await mail.sendMail("wgbila@gmail.com", "SUBJECT", "texto de prueba");
    expect(true).toBe(true);
  });
});
