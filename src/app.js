const express = require("express")
const bodyParser = require("body-parser")
const compression = require("compression")
const helmet = require("helmet")
const multer = require("multer")

const app = express()
const multerUpload = multer({ storage: multer.memoryStorage() })
const s3Client = require("./s3Client")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.use(helmet())

app.get("/healthz", (_, res) => {
  res.status(204).send()
})

app.post("/:bucket/:section", multerUpload.single("file"), async (req, res) => {
  try {
    const { bucket, section } = req.params
    const { buffer, size, originalname } = req.file
    await s3Client.putObject(
      bucket,
      `${section}/${new Date().toLocaleDateString("ko-KR")}/${originalname}`,
      buffer,
      size
    )
    res.status(204).send()
  } catch (e) {
    res.status(500).send(e.toString())
  }
})

module.exports = app
