const { ProductoInv } = require("../../models/productoInv");
const { Producto } = require("../../models/producto");
const _ = require("lodash");

async function reservar(idProducto, cantidad) {
  await fillProductoReserva(idProducto);
  const list = await findByProducto(idProducto);
  const listNoOcupados = manyOcupado(list, false);
  const noOcupados = listNoOcupados.length;

  if (noOcupados < cantidad)
    return {
      type: "ERROR",
      msg: `La cantidad que se han solicitado no esta disponible. Solo hay ${noOcupados} disponible(s)`,
      data: null,
    };

  let i = 0;
  const fechaOcupado = new Date();
  let listToReturn = [];

  for (const model of listNoOcupados) {
    await ProductoInv.findByIdAndUpdate(model._id, {
      ocupado: true,
      fechaOcupado: fechaOcupado,
    });
    listToReturn.push({
      producto: model._id,
      ocupado: true,
      fechaOcupado: fechaOcupado,
    });
    i = i + 1;
    if (i === cantidad) return { type: "SUCCESS", data: listToReturn };
  }
}

function manyOcupado(list, ocupado) {
  const result = _.find(list, { ocupado: ocupado });
  return result;
}

async function fillProductoReserva(idProducto) {
  const producto = await Producto.findById(idProducto);
  const list = await findByProducto(idProducto);
  const cantidadReserva = list.length;
  const cantidadFill = producto.cantidad - cantidadReserva;

  if (producto.cantidad > cantidadReserva)
    await fillReserva(idProducto, cantidadFill);
}

async function liberar(idReserva) {
  await ProductoInv.findByIdAndUpdate(idReserva, {
    ocupado: false,
    fechaOcupado: null,
  });
}

async function fillReserva(idProducto, cantidad) {
  let body = { producto: idProducto, ocupado: false, fechaOcupado: null };
  let reserva;
  for (let i = 0; i < cantidad; i++) {
    reserva = new ProductoInv(body);
    await reserva.save();
  }
}

async function findByProducto(idProducto) {
  const list = await ProductoInv.find({ producto: idProducto }).lean();
  return list;
}

exports.reservar = reservar;
exports.liberar = liberar;
