const express = require("express");
const router = express.Router();
const candidatoController = require("../controllers/candidatoController");
const tokenService = require("../services/tokenService");

router.get(
  "/",
  tokenService.verificarToken,
  candidatoController.buscarCandidatos
);
router.post(
  "/add",
  tokenService.verificarTokenThrow,
  candidatoController.adicionarCandidato
);

router.delete(
  "/:idCandidato",
  tokenService.verificarTokenThrow,
  candidatoController.removerCandidato
);

module.exports = router;
