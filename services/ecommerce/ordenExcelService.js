const moment = require("moment");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");

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
          "% Dto": model.bodyNubefact.descuento_global,
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
    status: ["FACTURADO", "PAGADO"],
  })
    .sort({ date: 1 })
    .lean();

  return result;
}

async function generateExtracto(month, year) {
  const result = await findOrden(month, year);
  if (!result || result.length == 0) return null;

  let list = [];
  let producto;

  for (const model of result)
    if (
      model.bodyNubefact &&
      model.bodyNubefact.items &&
      model.bodyNubefact.items.length > 0
    )
      for (const body of model.bodyNubefact.items) {
        producto = await Producto.findOne({
          codigoCompleto: body.codigo,
        }).lean();

        list.push({
          Serie: model.bodyNubefact.serie,
          Numero: model.bodyNubefact.numero,
          Fecha: moment(model.fecha).format("DD/MM/YYYY"),
          Nombre: model.bodyNubefact.cliente_denominacion,
          "% Dto": model.bodyNubefact.descuento_global,
          "Dto PP": 0,
          "Suma Dtos": body.descuento,
          "Base Imponible": body.precio_unitario,
          Impuestos: body.igv,
          Total: body.igv + body.precio_unitario,
          CIF: model.bodyNubefact.cliente_numero_de_documento,
          NIF20: model.bodyNubefact.cliente_numero_de_documento,
          "NOMBRE COMERCIAL": model.bodyNubefact.cliente_denominacion,
          Referencia: body.codigo,
          Descripcion: body.descripcion,
          talla: producto && producto.talla,
          color: producto && producto.color,
          Uds: body.cantidad,
          Precio: b0d7.precio_unitario,
        });
      }

  return list;
}

exports.findOrden = findOrden;
exports.generateResumen = generateResumen;
exports.generateExtracto = generateExtracto;
