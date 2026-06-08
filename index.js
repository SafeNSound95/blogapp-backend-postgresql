const express = require("express");
const { PORT } = require("./utils/config");
const { connectToDb } = require("./utils/db");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { errorHandler } = require("./utils/middleware");
const { Blog, User } = require("./models");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

app.post("/api/reset", async (req, res) => {
  try {
    await Blog.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to reset database" });
  }
});

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use(errorHandler);

const main = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
  });
};

main();
