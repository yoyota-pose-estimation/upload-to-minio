const Minio = require("minio")

const {
  S3_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_USE_HTTPS
} = process.env

module.exports = new Minio.Client({
  port: parseInt(S3_ENDPOINT.split(":").pop(), 10),
  useSSL: Boolean(S3_USE_HTTPS),
  endPoint: S3_ENDPOINT.split(":").shift(),
  accessKey: AWS_ACCESS_KEY_ID,
  secretKey: AWS_SECRET_ACCESS_KEY
})
