const { Blog } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);

  if (!req.blog) {
    return res.status(404).end();
  }

  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer "))
    return res.status(401).json({ error: "Missing token" });

  try {
    req.token = jwt.verify(authorization.substring(7), SECRET);
    next();
  } catch (error) {
    next(error);
  }
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (
    error.message === "data and salt arguments required" ||
    error.message === "data and hash arguments required"
  ) {
    return res.status(400).json({
      error: ["password is required and must not be empty"],
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: error.message });
  }

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      error: error.errors.map((err) => err.message),
    });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { blogFinder, errorHandler, tokenExtractor };
