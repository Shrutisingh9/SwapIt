const { Router } = require("express");
const AuthService = require("./auth.service");
const { validateRequest } = require("../../core/http/requestValidator");
const { loginSchema, registerSchema } = require("./auth.dto");

const router = Router();
const service = new AuthService();

router.post(
  "/register",
  validateRequest(registerSchema, "body"),
  async (req, res, next) => {
    try {
      const result = await service.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  validateRequest(loginSchema, "body"),
  async (req, res, next) => {
    try {
      const result = await service.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { authRouter: router };
