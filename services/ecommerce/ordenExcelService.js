const moment = require("moment");
const { OrdenCompra } = require("../../models/ordenCompra");

async function generateResumen(month, year) {
  const result = await findOrden(month, year);
  if (!result || result.length == 0) return null;

  let list = [];

  for (const model of result)
    if (
      model.bodyNubefact &&
      model.bodyNubefact.items &&
      model.bodyNubefact.items.length > 0
    )
      for (const body of model.bodyNubefact.items) {
        list.push({
          Serie: model.bodyNubefact.serie,
          Numero: model.bodyNubefact.numero,
          Fecha: moment(model.fecha).format("DD/MM/YYYY"),
          Nombre: model.bodyNubefact.cliente_denominacion,
          "% Dto": 0,
          "Dto PP": 0,
          "Suma Dtos": body.descuento,
          "Base Imponible": body.precio_unitario,
          Impuestos: body.igv,
          Total: body.igv + body.precio_unitario,
          CIF: model.bodyNubefact.cliente_numero_de_documento,
        });
      }

  return list;
}

async function findOrden(month, year) {
  const ini = new Date(year, month - 1, 1, -6, 0, 0);
  const endTemp = new Date(year, month, 0);
  const end = moment(endTemp).endOf("month").toDate();

  const result = await OrdenCompra.find({
    date: {
      $gte: ini,
      $lte: end,
    },
  })
    .sort({ date: 1 })
    .lean();

  return result;
}

exports.findOrden = findOrden;
exports.generateResumen = generateResumen;
