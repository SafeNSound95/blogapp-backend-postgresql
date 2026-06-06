const express = require("express");
const { PORT } = require("./utils/config");
const { connectToDb } = require("./utils/db");
const blogRouter = require("./controllers/blogs");

const app = express();
app.use(express.json());
app.use("/api/blogs", blogRouter);

const main = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
  });
};

main();
