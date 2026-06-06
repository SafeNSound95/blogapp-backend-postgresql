const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);

  if (!req.blog) {
    return res.status(404).end();
  }

  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.message === "data and salt arguments required") {
    return res.status(400).json({
      error: ["password is required and must not be empty"],
    });
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

module.exports = { blogFinder, errorHandler };
