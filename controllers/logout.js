const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const { Session } = require("../models");

router.delete("/", tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      token: req.tokenRaw,
    },
  });

  res.status(204).end();
});

module.exports = router;
