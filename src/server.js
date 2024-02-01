require("express-async-errors");

const cors = require("cors")

const uploadConfig = require("./configs/upload")
const AppError = require("./utils/AppError");
const express = require("express");
const app = express();

app.use(cors())

app.use(express.json()); 

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDERS))

const routes = require("./routes");
const migrationsRun = require("../src/database/sqlite/migration");
migrationsRun();

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
