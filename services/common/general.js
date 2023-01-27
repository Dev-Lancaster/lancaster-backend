const { ImagenesSistema } = require("../../models/imagenesSistema");

function thStyle() {
  return `style =
    "border: none;padding: 15px 5px; display: table-cell; text-align: right; vertical-align: middle; border-radius: 2px;"`;
}

function tdStyle() {
  return `style =
    "border: none;padding: 15px; display: table-cell; vertical-align: middle; border-radius: 2px;"`;
}

function trStyle() {
  return `style="border-bottom: 1px solid #efefef;"`;
}

async function mailTemplate(textHeader) {
  const logo = await ImagenesSistema.findOne({ tipo: "logo" }).lean();

  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-size: 22px;margin:0
      }
        html {
        line-height: 1.5;
      }
      .container {
        width: 70%;
        margin: 0 auto;
        max-width: 1280px;
      }
      .row {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
      }
      .row .col {
        float: left;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 .75rem;
        min-height: 1px;
      }
      .row .col.s12 {
        width: 100%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      *, *:before, *:after {
        -webkit-box-sizing: inherit;
        box-sizing: inherit;
      }
    </style>
  </head>
  <body style="background: #e1e6e9">
    <div style="width: 70%;margin: 0 auto;max-width: 1280px;">
      <div class="row" style="margin-bottom: 0px">
        <div class="col s12" style="text-align: center;">
          <img
            src="${logo.url}"
            alt="Logo"
            style="width: 9%; margin-top: 10px"
          />
        </div>
      </div>
      <div class="row" style="text-align: center;">
        <div class="col 12" style="width: 100%">
          <h4 style="font-size: 2.28rem;line-height: 110%;margin: 1.52rem 0 .912rem 0;font-weight: 400;font-family:sans-serif">Ecommerce</h4>
        </div>
      </div>
      <div class="row">
        <div class="col s12" style="background: #fff; padding: 15px;text-align: justify;font-family:sans-serif;font-size:18px">
            ${textHeader}
        </div>
      </div>
      </div>
    </div>
  </body>
</html>
`;
}
