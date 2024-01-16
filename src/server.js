require("express-async-errors");

const AppError = require("./utils/AppError");
const express = require("express");
const app = express();

app.use(express.json()); //Para a api saber qual o padrão vamos utilizar para enviar infos que no caso é o json.

const routes = require("./routes");
const database = require("../src/database/sqlite");
database()

app.use(routes);
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }
  console.error(error);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
