const { Sequelize } = require("sequelize");
const { TESTING, DATABASE_URL, TEST_DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

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

const umzugConfig = {
  migrations: { glob: "migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(umzugConfig);
  const migrations = await migrator.up();

  console.log({ migrations: migrations.map((m) => m.name) });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(umzugConfig);

  await migrator.down();
};

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectToDb, sequelize, rollbackMigration };
