const { Tarifas } = require("../../models/tarifas");
const _ = require("lodash");

async function findAll() {
  const result = await Tarifas.find()
    .sort({ departamento: 1, provincia: 1, distrito: 1 })
    .lean();
  return result;
}

async function findById(id) {
  const tarifa = await Tarifas.findById(id).lean();
  return tarifa;
}

async function updateById(id, model) {
  await Tarifas.findByIdAndUpdate(id, model);
}

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
exports.findAll = findAll;
exports.findById = findById;
exports.updateById = updateById;
