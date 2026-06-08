const { Sequelize } = require("sequelize");
const { TESTING, DATABASE_URL, TEST_DATABASE_URL } = require("./config");

const databaseUrl =
  TESTING === "true" || !DATABASE_URL ? TEST_DATABASE_URL : DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectToDb, sequelize };
