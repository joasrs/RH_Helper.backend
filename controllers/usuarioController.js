const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");
const tokenService = require("../services/tokenService");
const { Sequelize } = require("sequelize");

module.exports = class UsuarioController {
  static async cadastrarUsuario(req, res) {
    const usuario = {
      nome: req.body.nome ? req.body.nome[0] : "",
      email: req.body.email ? req.body.email[0] : "",
      login: req.body.login ? req.body.login[0] : "",
      senha: req.body.senha ? req.body.senha[0] : "",
      senhaConfirmacao: req.body.senha ? req.body.senhaConfirmacao[0] : "",
    };

    const validacao = {
      validacaoUsuario: undefined,
      validacaoEmail: undefined,
      validacaoSenha: undefined,
      camposObrigatorios: undefined,
    };

    if (!usuario.nome) {
      validacao.camposObrigatorios = "Nome";
    }

    if (!usuario.email) {
      validacao.camposObrigatorios +=
        (validacao.camposObrigatorios ? ", " : "") + "E-mail";
    }

    if (!usuario.login) {
      validacao.camposObrigatorios +=
        (validacao.camposObrigatorios ? ", " : "") + "usuário";
    }

    if (!usuario.senha) {
      validacao.camposObrigatorios +=
        (validacao.camposObrigatorios ? ", " : "") + "Senha";
    }

    if (!usuario.senhaConfirmacao) {
      validacao.camposObrigatorios +=
        (validacao.camposObrigatorios ? ", " : "") + "Confirmação de senha";
    }

    if (usuario.senhaConfirmacao != usuario.senha) {
      validacao.validacaoSenha = "Senhas não conferem.";
    }

    if (
      usuario.email &&
      (await Usuario.count({
        where: {
          email: usuario.email,
        },
      })) > 0
    ) {
      validacao.validacaoEmail = "E-mail já está sendo utilizado.";
    }

    if (
      usuario.login &&
      (await Usuario.count({
        where: {
          login: usuario.login,
        },
      })) > 0
    ) {
      validacao.validacaoUsuario = "Usuário já está sendo utilizado.";
    }
    if (
      validacao.validacaoEmail ||
      validacao.validacaoUsuario ||
      validacao.validacaoSenha ||
      validacao.camposObrigatorios
    ) {
      let mensagem;
      if (validacao.camposObrigatorios) {
        mensagem =
          "Os seguintes dados são obrigatórios: " +
          validacao.camposObrigatorios;
      } else if (
        validacao.validacaoEmail ||
        validacao.validacaoUsuario ||
        validacao.validacaoSenha
      ) {
        mensagem =
          (validacao.validacaoEmail ?? "") +
          " " +
          (validacao.validacaoUsuario ?? "") +
          " " +
          (validacao.validacaoSenha ?? "");
      }

      res.status(422).json({ message: mensagem });
    } else {
      //gera a senha criptografada
      usuario.senha = bcrypt.hashSync(usuario.senha, bcrypt.genSaltSync());

      const novoUsuario = (await Usuario.create(usuario)).get({ plain: true });
      novoUsuario.senha = "";
      novoUsuario.token = gerarTokenAutenticado(novoUsuario);

      res.status(201).json({
        message: "Usuário adicionado com sucesso!",
        usuario: novoUsuario,
      });
    }
  }

  static async autenticarUsuario(req, res) {
    const login = req.body.login ? req.body.login[0] : "";
    const senha = req.body.senha ? req.body.senha[0] : "";

    if (!login || !senha) {
      return res
        .status(422)
        .json({ message: "é necessário informar usuário e senha" });
    }

    const usuario = await Usuario.findOne({
      where: {
        login: login,
      },
    });

    if (usuario) {
      const usuarioPlain = usuario.get({ plain: true });

      if (bcrypt.compareSync(senha, usuarioPlain.senha)) {
        usuarioPlain.token = gerarTokenAutenticado(usuario);

        // pra não aparecer a senha na resposta
        usuarioPlain.senha = undefined;

        return res.status(201).json({
          message: "Usuário logado com sucesso!",
          usuario: usuarioPlain,
        });
      }
    }

    return res.status(422).json({ message: "Usuário ou senha incorretos" });
  }

  static async getDadosUsuarioPeloToken(req, res) {
    try {
      if (req.usuario) {
        return res.status(201).json({
          usuario: req.usuario,
        });
      }

      res.status(404).json({
        message: "Dados do usuário não foram encontrados.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao extrair informações do token: " + error });
    }
  }
};

function gerarTokenAutenticado(usuario) {
  return tokenService.assinarToken({
    id: usuario.id,
  });
}
