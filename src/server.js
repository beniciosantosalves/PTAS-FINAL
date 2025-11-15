import express, { json } from "express"

import Database from "./databases.js"

const app = express()

app.use(express.json())

const database = new Database()

app.get("/", (req, res) => {
    res.send("Você está na página principal")
})

app.get("/user", (req, res) => {
    const data = database.select("usuario")

    res.status(200).json(data)
})

app.post("/user", (req, res) => {
    const { nome, idade, email } = req.body

    if (nome && idade && email) {
        database.insert("usuario", { nome, idade, email })

        return res.status(201).send("Usuário criado")
    }

    return res.status(400).send("Informações inválidas")
})

app.get("/user/produtos", (req, res) => {
    const data = database.select("produtos")

    res.status(200).json(data)
})

app.post("/user/produtos", (req,res) => {
    const { nome, valor, quant } = req.body

    if (nome && valor && quant) {
        database.insert("produtos", {nome, valor, quant})

        return res.status(201).send("Produto criado")
    }

    return res.status(400).send("Informações inválidas")
})


app.listen(3333, () => console.log("Hello word!!!"))