const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

router.post("/", async (req, res) => {
  const blog = await Blog.findByPk(req.body.blogId);
  const user = await User.findByPk(req.body.userId);

  if (!blog || !user) {
    return res.status(400).json({ error: "invalid user or blog" });
  }

  const readingList = await ReadingList.create(req.body);
  res.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.token.id);
  const readingList = await ReadingList.findByPk(req.params.id);

  if (!user || !readingList)
    return res.status(400).json({ error: "Invalid user or readingList" });

  if (readingList.userId !== user.id)
    return res.status(401).json({ error: "Unauthorized user" });

  try {
    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
