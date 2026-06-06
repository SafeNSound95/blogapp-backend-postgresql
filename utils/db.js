const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {
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
