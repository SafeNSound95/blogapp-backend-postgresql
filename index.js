const express = require("express");
const { PORT } = require("./utils/config");
const { connectToDb } = require("./utils/db");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { errorHandler } = require("./utils/middleware");

const app = express();
app.use(express.json());
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
