const router = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder, tokenExtractor } = require("../utils/middleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
    ],
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.token.id);
    if (!user) {
      return res.status(401).json({ error: "unauthorized user" });
    }
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.token.id);
  if (!user) {
    return res.status(401).json({ error: "unauthorized user" });
  }

  if (req.blog.userId !== user.id)
    return res.status(401).json({ error: "unauthorized user" });

  await req.blog.destroy();
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
