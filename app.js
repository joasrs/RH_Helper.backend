require("dotenv").config({ path: ".env.local" });
const express = require("express");
const app = express();
const cors = require("cors");
const usuariosRouters = require("./routers/usuariosRouters");
const candidatoRouters = require("./routers/candidatoRouters");
const porta = process.env.PORT;

app.use(
  cors({
    origin: [process.env.ORIGEM_HTTP, "https://www.faouhater.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    //credentials: true
  })
);

// tratamento pra requisições via POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// seta os routers nos middlewares, ** tem que importar o router antes
app.use("/usuario", usuariosRouters);
app.use("/candidato", candidatoRouters);

//rota padrão
app.get("/", (req, res) => {
  console.log(servidor.address());
  res.status(200).send(`API acessada com sucesso!`);
});

// qualquer endereço digitado ele cai nesse middleware mostrando a pagina 404, ** use
app.use((req, res) => {
  res.status(404).json({ message: "Página não encontrada" });
});

// inicia o servidor
const servidor = app.listen(porta, () => {
  console.log("servidor rodando na porta: " + porta);
});
