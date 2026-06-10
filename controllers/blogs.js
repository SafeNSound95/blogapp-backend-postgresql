const router = require("express").Router();
const { Blog, User } = require("../models");
const {
  blogFinder,
  tokenExtractor,
  sessionValidator,
} = require("../utils/middleware");
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

router.post("/", tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  tokenExtractor,
  sessionValidator,
  blogFinder,
  async (req, res) => {
    if (req.blog.userId !== req.user.id)
      return res.status(401).json({ error: "unauthorized user" });

    await req.blog.destroy();
    res.status(204).end();
  },
);

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
