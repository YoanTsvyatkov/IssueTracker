import auth from './routers/auth-controller.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

initRouthers('/api/', auth)

app.all('/*', (req, res) => {
    res.sendStatus(404);
})

app.listen(process.env.PORT, () => {
    console.log(`Started server`);
})

function initRouthers(path, routhers){
    app.use(path, routhers);
}