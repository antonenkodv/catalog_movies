const multer = require('multer')
const path = require("path");
const fs = require("fs");

module.exports = {
    formDataImport() {
        let storage = multer.diskStorage({
            destination: async function (req, file, cb) {
                try {
                    const filePath = path.join(__dirname, `./public/movies/${date}.txt`)
                    if (!fs.existsSync(filePath)) {
                        fs.mkdirSync(filePath, {recursive: true})
                    }
                    cb(null, filePath);
                } catch (err) {
                    console.log(err)
                }
            },
            filename: function (req, file, cb) {
                let date = new Date();
                date = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2)
                cb(null, date + '.' + 'txt');
            }
        })
        const upload = multer({storage: storage})
        return upload.any('form-data');
    }
}