const express = require("express")
const app = express()
const port = 3000

app.use(express.json())

app.get("/",(req, res) => {
    res.send("Hello world");
})

app.post("", (req, res) => {

})

app.all("*", (req, res) => {
    res.sendStatus(404);
})

app.listen(port, () => {
    console.log(`Started server on port ${port}`)
})