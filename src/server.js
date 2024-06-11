require("express-async-errors");

const AppError = require("./utils/AppError");
const express = require("express");
const app = express();

const cors = require("cors");

const uploadConfig = require("./configs/upload");
app.use("/files", express.static(uploadConfig.UPLOAD_FOLDERS));

app.use(cors());
app.use(express.json());

const routes = require("./routes");
app.use(routes);

const sqliteConnection = require("./database/sqlite");
sqliteConnection()

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
