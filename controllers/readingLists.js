const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");
const { tokenExtractor, sessionValidator } = require("../utils/middleware");

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;

    if (blogId === undefined || userId === undefined) {
      return res.status(400).json({ error: "blogId and userId required" });
    }

    const blog = await Blog.findByPk(blogId);
    const user = await User.findByPk(userId);

    if (!user || !blog) {
      return res.status(404).json({ error: "invalid user or blog" });
    }

    const existing = await ReadingList.findOne({
      where: { blogId, userId },
    });

    if (existing) {
      return res.status(400).json({ error: "already exists" });
    }

    const readingList = await ReadingList.create({
      blogId,
      userId,
      read: false,
    });

    res.status(201).json({
      id: readingList.id,
      blog_id: readingList.blogId,
      user_id: readingList.userId,
      read: readingList.read,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, sessionValidator, async (req, res, next) => {
  const readingList = await ReadingList.findByPk(req.params.id);

  if (!req.user || !readingList)
    return res.status(404).json({ error: "Invalid user or readingList" });

  if (readingList.userId !== req.user.id)
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
