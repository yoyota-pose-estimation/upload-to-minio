const app = require("./app")

app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line no-console
  console.log("Server start!")
})
