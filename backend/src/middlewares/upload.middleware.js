const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("text/") ||
      file.mimetype === "application/json" ||
      file.originalname.match(/\.(js|jsx|ts|tsx|py|java|c|cpp|html|css|json)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only code/text files are allowed!"), false);
    }
  },
});

module.exports = upload;
