const { Tarifas } = require("../../models/tarifas");

async function findTarifas() {
  const result = await Tarifas.aggregate([
    {
      $group: {
        _id: {
          departamento: "$departamento",
          provincia: "$provincia",
        },
        data: { $push: "$$ROOT" },
      },
    },
  ]);
  return result;
}

exports.findTarifas = findTarifas;
