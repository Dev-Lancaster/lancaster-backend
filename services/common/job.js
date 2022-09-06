const cron = require("node-cron");
const ProductoService = require("../ecommerce/productoService");

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *

field	        value
second	        0-59
minute	        0-59
hour	        0-23
day of month	1-31
month	        1-12 (or names)
day of week	    0-7 (or names, 0 or 7 are sunday)
*/

function checkOcupados() {
  cron.schedule("5 * * * *", async () => {
    await ProductoService.checkOcupados();
  });
}

exports.checkOcupados = checkOcupados;
