const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class diskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TEMP_FOLDERS, file),
      path.resolve(uploadConfig.UPLOAD_FOLDERS, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOAD_FOLDERS, file);

    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = diskStorage;
