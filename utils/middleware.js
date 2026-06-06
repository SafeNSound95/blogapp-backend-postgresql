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

  if (
    error.name === "SequelizeDatabaseError" ||
    error.name === "SequelizeValidationError"
  ) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { blogFinder, errorHandler };
