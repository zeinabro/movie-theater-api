const port = 3000
const app = require("./src/app")
const { db } = require("./db/connection")

app.listen(port, () => {
    db.sync
    console.log(`Listening on http://localhost:${port}`)
})
