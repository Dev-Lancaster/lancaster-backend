const { ImagenesSistema } = require("../../models/imagenesSistema");

const thStyle = `style =
    "border: none;padding: 15px 5px; display: table-cell; text-align: right; vertical-align: middle; border-radius: 2px;"`;

const tdStyle = `style =
    "border: none;padding: 15px; display: table-cell; vertical-align: middle; border-radius: 2px;"`;

const trStyle = `style="border-bottom: 1px solid #efefef;"`;

async function mailTemplate(textHeader) {
  const logo = await ImagenesSistema.findOne({ tipo: "logo" }).lean();

  return `<!DOCTYPE html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
    />
    <style>
    *{font-size: 19px}
    table{
      width: 100%;
    display: table;
    border-collapse: collapse;
    border-spacing: 0;
    }
    tr {
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
td, th {
    padding: 15px 5px;
    display: table-cell;
    text-align: left;
    vertical-align: middle;
    border-radius: 2px;
}
    </style>
  </head>
  <body>
    <div class="container">
      <div
        class="row"
        style="
          background-color: #efefef;
          height: 100%;
          padding: 25px;
          margin: 25px;
        "
      >
        <div
          class="col s12 m6"
          style="background-color: #fff; padding: 25px; margin: 25px"
        >
          <div class="row">
            <div class="col s12">
            <img src='${logo.url}'/>
              <div
                style="
                  font-size: 2.28rem;
                  font-weight: 400;
                  font-family: sans-serif;
                  display: initial;
                  float: right
                "
              >
                Ecommerce
              </div>
            </div>
          </div>
          ${textHeader}
        </div>
      </div>
    </div>
  </body>
</html>
`;
}

exports.mailTemplate = mailTemplate;
exports.thStyle = thStyle;
exports.tdStyle = tdStyle;
exports.trStyle = trStyle;
