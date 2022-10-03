const Excel = require("exceljs");
const fs = require("fs");
const ErrorService = require("../admin/ErrorService");

async function existFile(filename) {
  try {
    if (fs.existsSync(filename)) return true;
    return false;
  } catch (e) {
    await ErrorService.save("EXIST FILE - ERROR", e);
    return false;
  }
}

/**
 * Lee un archivo de excel
 * @param {String} filename
 * @returns worksheet
 */
async function readExcel(filename) {
  let exist;
  exist = await existFile(filename);
  if (!exist) return null;

  let wb = new Excel.Workbook();
  try {
    console.log(filename);
    wb = await wb.xlsx.readFile(filename);
    await ErrorService.save("EXCEL HELPER 4", "4");
  } catch (e) {
    await ErrorService.save("READ FILE - ERROR", e);
  }
  return wb;
}

/**
 * Creación de workbook
 * @param {String} user
 * @returns workbook
 */
function createWorkbook(user) {
  const workbook = new Excel.Workbook();
  workbook.creator = user;
  workbook.created = new Date();
  return workbook;
}

/**
 * Separa los resultados de niveles en el mes
 * que se pasa como parametro
 * @param {array} result
 * @param {integer} month
 * @returns array con los datos del mes
 */
function separateDataInMonth(result, month) {
  return result.filter(function (model) {
    return model.fecha.getMonth() + 1 === month;
  });
}

function allCenter(worksheet, cell) {
  worksheet.getCell(cell).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
}

function align(worksheet, cell, vertical, horizontal) {
  worksheet.getCell(cell).alignment = {
    vertical: vertical,
    horizontal: horizontal,
  };
}

function setFont(worksheet, cell, bold, size) {
  worksheet.getCell(cell).font = { bold: bold, size: size };
}

function allCenterBoldDefault(
  worksheet,
  cell,
  size = 14,
  vertical = "middle",
  horizontal = "center",
  bold = true
) {
  worksheet.getCell(cell).alignment = {
    vertical: vertical,
    horizontal: horizontal,
  };
  worksheet.getCell(cell).font = { bold: bold, size: size };
}

function border(worksheet, cell, style) {
  worksheet.getCell(cell).border = {
    top: { style: style },
    left: { style: style },
    bottom: { style: style },
    right: { style: style },
  };
}

exports.createWorkbook = createWorkbook;
exports.separateDataInMonth = separateDataInMonth;
exports.allCenter = allCenter;
exports.align = align;
exports.setFont = setFont;
exports.allCenterBoldDefault = allCenterBoldDefault;
exports.border = border;
exports.readExcel = readExcel;
