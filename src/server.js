require("express-async-errors");

const routes = require("./routes");
const express = require("express");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const uploadConfig = require("./configs/upload");
const app = express();

const sqliteConnection = require("./database/sqlite");
sqliteConnection();

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDERS));

app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

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
