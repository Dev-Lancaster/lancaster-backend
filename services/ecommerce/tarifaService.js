const { Tarifas } = require("../../models/tarifas");
const _ = require("lodash");

async function findTarifas() {
  const result = await groupByDepartamento();

  const data = result.map((model) => {
    const provincias = _.groupBy(model.data, "provincia");
    const formattedProvincias = Object.entries(provincias).map(
      ([nombre, data]) => ({
        nombre,
        data,
      })
    );
    return {
      departamento: model._id.departamento,
      provincias: formattedProvincias,
    };
  });

  return data;
}

async function groupByDepartamento() {
  const result = await Tarifas.aggregate([
    {
      $group: {
        _id: {
          departamento: "$departamento",
        },
        data: { $push: "$$ROOT" },
      },
    },
    {
      $sort: {
        "_id.departamento": 1,
      },
    },
  ]);
  return result;
}

exports.findTarifas = findTarifas;
exports.groupByDepartamento = groupByDepartamento;
