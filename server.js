// automatically creating table on startup and inserting data
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const ExcelJS = require("exceljs");

// Db Connect
const sequelize = require("./model/dbconfig");
const Placement = require("./model/PlacementModel");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
sequelize.sync();

app.get("/", async (req, res) => {
  const Placements = await Placement.findAndCountAll();
  const posts = Placements.rows;

  const tableRows = posts
    .map(
      (data) => `
        <tr>
            <td>${data.date}</td>
            <td>${data.workCarried}</td>
            <td>${data.workCarried}</td>
            <td>${data.Competency}</td>
            <td> 
            <div class="button-group">
              <a href="/updatePlacement/${data.id}" class="cu-btn">Edit</a>

              <form
                action="http://localhost:8080/deletePlacement"
                method="POST"
              >
                <input type="hidden" value="${data.id}" name="id" />
                <button class="cu-btn">Delete</button>
              </form> 
              </div>
              </td>
        </tr>
    `
    )
    .join("");

  // Generate the complete HTML response
  const htmlResponse = `
  <html>
  <head>
    <title>Crud Operation</title>
    
    <link rel="stylesheet"  href="./index.css">
    </head>
     <style>
     :root {
      --main-blue: #71b7e6;
      --main-purple: #9b59b6;
      --main-grey: #ccc;
      --sub-grey: #d9d9d9;
    }
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: sans-serif;
      text-decoration: none;
      list-style: none;
    }
    body {
      
      background: linear-gradient(135deg, var(--main-blue), var(--main-purple));
    
    }
    .header {
      position: sticky;
      top: 0;
      width: 100%;
      box-shadow: 0 4px 20px hsla(207, 24%, 35%, 0.1);
      background-color: #151418;
      z-index: 1;
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
    }

    .logo a {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }

    .logo a span {
      color: #8739fa;
    }

    .menu {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .menu a {
      display: block;
      padding: 7px 15px;
      font-size: 17px;
      font-weight: 500;
      transition: 0.2s all ease-in-out;
      color: #fff;
    }

    .menu:hover a {
      opacity: 0.4;
    }

    .menu a:hover {
      opacity: 1;
      color: #fff;
    }

    .menu-icon {
      display: none;
    }

    #menu-toggle {
      display: none;
    }

    #menu-toggle:checked ~ .menu {
      transform: scale(1, 1);
    }

    @media only screen and (max-width: 950px) {
      .menu {
        flex-direction: column;
        background-color: #151418;
        align-items: start;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        z-index: 1;
        transform: scale(1, 0);
        transform-origin: top;
        transition: transform 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      }

      .menu a {
        margin-left: 12px;
      }

      .menu li {
        margin-bottom: 10px;
      }

      .menu-icon {
        display: block;
        color: #fff;
        font-size: 28px;
        cursor: pointer;
      }
    }

    table {
      border: 1px solid #ccc;
      border-collapse: collapse;
      margin: 0;
      padding: 0;
      width: 100%;
      table-layout: fixed;
    }

    table caption {
      font-size: 1.5em;
      margin: 0.5em 0 0.75em;
    }

    table tr {
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      padding: 0.35em;
    }

    table th,
    table td {
      padding: 0.625em;
      text-align: start;
    }

    table th:first-child,
    table td:first-child {
      text-align: center;
    }
    table th:first-child,
    table td:first-child, table th:last-child,
    table td:last-child {
      width: 200px;
    }

    table th {
      font-size: 0.85em;
      letter-spacing: 0.05em;
      padding: 10px;
      line-height: 1.5;
      text-transform: uppercase;
    }

    .button-group {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .cu-btn, button.cu-btn {
      padding: 10px 20px;
      background: lavender;
      border-radius: 5px;
      color: #000;
      font-weight: 600;
      border: none !important;
      font-size: 15px;
    }

    .card {
      padding: 25px;
    }

    @media screen and (max-width: 600px) {
      table {
        border: 0;
      }

      table caption {
        font-size: 1.3em;
      }

      table thead {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      table tr {
        border-bottom: 3px solid #ddd;
        display: block;
        margin-bottom: 0.625em;
      }

      table td {
        border-bottom: 1px solid #ddd;
        display: block;
        font-size: 0.8em;
        text-align: right;
      }

      table td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        text-transform: uppercase;
      }

      table td:last-child {
        border-bottom: 0;
      }
    }

  </style>

  <body>
      <header class="header">
        <nav>
          <div class="logo">
            <a href="index.html">Placement <span>Diary</span></a>
          </div>
          <div class="button-group">
            <a href="/download" class="cu-btn export-btn">Export Pdf</a>
            <a href="/excelDownload" class="cu-btn export-btn">Export Excel</a>
            <a href="/addPlacement" class="cu-btn add-btn">Add</a>
          </div>
        </nav>
      </header>
      <div class="card">
        <table id="data-table">
            <thead>
                <tr>
                  <th>Date</th>
                  <th>Works Carried Out</th>
                  <th>Knowledge/ Experience gained or applied</th>
                  <th>Competency</th>
                  <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
      </div>
        <script src="server.js"></script>
  </body>
</html>


    `;

  // Set Content-Type header and send the HTML response
  res.setHeader("Content-Type", "text/html");
  res.send(htmlResponse);

  //   res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/addPlacement", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addForm.html"));
});

app.post("/addPlacement", async (req, res) => {
  const asd = {
    date: req.body.date,
    workCarried: req.body.works,
    knowledge: req.body.knowledge,
    Competency: req.body.competency,
  };
  res.setHeader("Content-Type", "text/plain");
  await Placement.create(asd).then(() => {
    res.redirect("/");
  });
});

app.get("/updatePlacement/:id", async (req, res) => {
  const id = req.params.id;
  await Placement.findOne({ where: { id: id } }).then((item) => {
    if (item != null) {
      res.send(`
      <html>
  <head>
    <title>Add Placement</title>
  </head>
  <style>
    /* all */
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
    }

    :root {
      --main-blue: #71b7e6;
      --main-purple: #9b59b6;
      --main-grey: #ccc;
      --sub-grey: #d9d9d9;
    }

    body {
      display: flex;
      height: 100vh;
      justify-content: center; /*center vertically */
      align-items: center; /* center horizontally */
      background: linear-gradient(135deg, var(--main-blue), var(--main-purple));
      padding: 10px;
    }
    /* container and form */
    .container {
      max-width: 700px;
      width: 100%;
      background: #fff;
      padding: 25px 30px;
      border-radius: 5px;
    }
    .container .title {
      font-size: 25px;
      font-weight: 500;
      position: relative;
    }

    .container .title::before {
      content: "";
      position: absolute;
      height: 3.5px;
      width: 30px;
      background: linear-gradient(135deg, var(--main-blue), var(--main-purple));
      left: 0;
      bottom: 0;
    }

    .container form .user__details {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 20px 0 12px 0;
    }
    /* inside the form user details */
    form .user__details .input__box.col-6 {
      width: calc(100% / 2 - 20px);
      margin-bottom: 15px;
    }

    .user__details .input__box .details {
      font-weight: 500;
      margin-bottom: 5px;
      display: block;
    }
    .user__details .input__box input {
      height: 45px;
      width: 100%;
      outline: none;
      border-radius: 5px;
      border: 1px solid var(--main-grey);
      padding-left: 15px;
      font-size: 16px;
      border-bottom-width: 2px;
      transition: all 0.3s ease;
    }

    .user__details .input__box input:focus,
    .user__details .input__box input:valid {
      border-color: var(--main-purple);
    }

    /* inside the form gender details */

    form .gender__details .gender__title {
      font-size: 20px;
      font-weight: 500;
    }

    form .gender__details .category {
      display: flex;
      width: 80%;
      margin: 15px 0;
      justify-content: space-between;
    }

    .gender__details .category label {
      display: flex;
      align-items: center;
    }

    .gender__details .category .dot {
      height: 18px;
      width: 18px;
      background: var(--sub-grey);
      border-radius: 50%;
      margin: 10px;
      border: 5px solid transparent;
      transition: all 0.3s ease;
    }

    #dot-1:checked ~ .category .one,
    #dot-2:checked ~ .category .two,
    #dot-3:checked ~ .category .three {
      border-color: var(--sub-grey);
      background: var(--main-purple);
    }

    form input[type="radio"] {
      display: none;
    }

    /* submit button */
    form .button {
      height: 45px;
      margin: 45px 0;
    }

    form .button input {
      height: 100%;
      width: 100%;
      outline: none;
      color: #fff;
      border: none;
      font-size: 18px;
      font-weight: 500;
      border-radius: 5px;
      background: linear-gradient(135deg, var(--main-blue), var(--main-purple));
      transition: all 0.3s ease;
    }

    form .button input:hover {
      background: linear-gradient(
        -135deg,
        var(--main-blue),
        var(--main-purple)
      );
    }

    @media only screen and (max-width: 584px) {
      .container {
        max-width: 100%;
      }

      form .user__details .input__box {
        margin-bottom: 15px;
        width: 100%;
      }

      form .gender__details .category {
        width: 100%;
      }

      .container form .user__details {
        max-height: 300px;
        overflow-y: scroll;
      }

      .user__details::-webkit-scrollbar {
        width: 0;
      }
    }
  </style>
  <body>
    <div class="container">
      <div class="title">Edit Placement</div>
      <form action="http://localhost:8080/updatePlacement/${item.dataValues.id}" method="POST">
        <div class="user__details">
          <div class="input__box col-6">
            <span class="details">Date</span>
            <input
              name="date"
              id="date"
              type="date"
              placeholder="E.g: John Smith"
              required
            />
          </div>
          <div class="input__box col-6">
          <span class="details">Competency</span>
          <input type="text" name="competency" id="competency" required />
        </div>
          <div class="input__box">
            <span class="details">Work Carried Out</span>
            <input class="message-area" name="works" id="works" required />
          </div>
          <div class="input__box">
            <span class="details"
              >Knowledge/ Experienced gained or applied</span
            >
            <input name="knowledge" id="knowledge" required />
          </div>

        </div>
        <div class="button">
          <input type="submit" value="Update" />
        </div>
      </form>
    </div>
  </body>
</html>
            <script>
                document.getElementById('date').value = '${item.dataValues.date}';
                document.getElementById('works').value = '${item.dataValues.workCarried}';
                document.getElementById('knowledge').value = '${item.dataValues.knowledge}';
                document.getElementById('competency').value = '${item.dataValues.Competency}';
            </script>
        `);
      //   res.sendFile(path.join(__dirname + "/views/editForm.html"));
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/updatePlacement/:id", async (req, res) => {
  const id = req.params.id;
  await Placement.findByPk(id).then((item) => {
    if (item != null) {
      item
        .update({
          date: req.body.date,
          workCarried: req.body.works,
          knowledge: req.body.knowledge,
          Competency: req.body.competency,
        })
        .then(() => {
          res.redirect("/");
        });
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/deletePlacement", async (req, res) => {
  const id = req.body.id;
  await Placement.findByPk(id).then((item) => {
    if (item != null) {
      item.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(404);
    }
  });
});

function createTable(doc, tableData, startX, startY) {
  const margin = 50;
  const columnCount = tableData[0].length;
  const rowCount = tableData.length;
  const columnWidth = 100;
  const rowHeight = 30;
  const borderWidth = 1;

  doc.font("Helvetica-Bold");

  let currentX = startX + borderWidth;
  let currentY = startY + borderWidth;

  // Draw table headers
  doc.fontSize(12);
  doc.fillColor("black");
  doc.lineWidth(borderWidth);

  for (let i = 0; i < columnCount; i++) {
    doc.text(tableData[0][i].toString(), currentX, currentY, {
      align: "left",
      width: columnWidth,
    });
    currentX += columnWidth;
  }

  currentY += rowHeight + borderWidth;

  doc.font("Helvetica");

  // Draw table rows
  for (let i = 1; i < rowCount; i++) {
    currentX = startX + borderWidth;

    for (let j = 0; j < columnCount; j++) {
      doc.text(tableData[i][j].toString(), currentX, currentY, {
        align: "left",
        width: columnWidth,
      });
      currentX += columnWidth;
    }

    currentY += rowHeight;
  }
}

function prepareTableData(data) {
  // Assuming data is an array of objects
  const keys = Object.keys(data[0]);
  const tableData = [keys];

  data.forEach((item) => {
    const rowData = keys.map((key) => item[key]);
    tableData.push(rowData);
  });

  return tableData;
}

app.get("/download", async (req, res) => {
  const Placements = await Placement.findAndCountAll();
  const posts = Placements.rows;

  let arr = [];
  const tableRows = posts.map((data) => {
    arr.push(data.dataValues);
  });

  const doc = new PDFDocument();

  const tableData = prepareTableData(arr);

  // doc.pipe(fs.createWriteStream("table.pdf"));
  doc.fontSize(12).text("Placement Data", { align: "center" }).moveDown(0.5);

  doc.moveDown(0.5);
  createTable(doc, tableData, doc.page.margins.left, doc.y);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=table_data.pdf");

  doc.pipe(res);
  doc.end();
});

app.get("/excelDownload", async (req, res) => {
  const Placements = await Placement.findAndCountAll();
  const posts = Placements.rows;

  let arr = [];
  const tableRows = posts.map((data) => {
    arr.push(data.dataValues);
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Define your dynamic data

  // Add the table headers
  worksheet.addRow([
    "DATE",
    "WORKS CARRIED OUT",
    "KNOWLEDGE/ EXPERIENCE GAINED OR APPLIED",
    "COMPETENCY",
  ]);

  // Add the table rows
  arr.forEach((row) => {
    worksheet.addRow([
      row.date,
      row.workCarried,
      row.workCarried,
      row.Competency,
    ]);
  });

  // Apply styles to headers
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" }, // Yellow color
    };
  });

  // Apply styles to data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  // Generate a unique filename for the Excel file
  const filename = `table_${Date.now()}.xlsx`;
  const filePath = `./${filename}`;

  // Save the workbook to a file
  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      // Set the response headers for downloading the Excel file
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Stream the file to the response
      fs.createReadStream(filePath).pipe(res);
    })
    .catch((error) => {
      console.error("Error creating Excel file:", error);
      res.status(500).send("Error creating Excel file.");
    })
    .finally(() => {
      // Delete the temporary file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        }
      });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Service endpoint= http://localhost:${PORT}`);
});
