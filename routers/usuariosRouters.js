const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const tokenService = require("../services/tokenService");
const { imageUpload } = require("../services/uploadService");

router.post("/add", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.autenticarUsuario);
router.get(
  "/token/informacoes",
  tokenService.verificarToken,
  usuarioController.getDadosUsuarioPeloToken
);

module.exports = router;
