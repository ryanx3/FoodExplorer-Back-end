const path = require("path")
const multer = require("multer")
const crypto = require("crypto")

const TEMP_FOLDERS = path.resolve(__dirname, "..", "..", "tmp")
const UPLOAD_FOLDERS = path.resolve(TEMP_FOLDERS, "uploads")

const MULTER = {
    storage: multer.diskStorage({
        destination: TEMP_FOLDERS,
        filename(req, file, callback) {
            const hashFile = crypto.randomBytes(10).toString("hex")
            const filename = `${hashFile}-${file.originalname}`

            return callback(null, filename)
        }
    })
}


module.exports = {
    TEMP_FOLDERS,
    UPLOAD_FOLDERS,
    MULTER
}