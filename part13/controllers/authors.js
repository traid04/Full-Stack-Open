const express = require("express");
const router = express.Router();
const { Blog } = require("../models/index");
const { fn, col } = require("sequelize");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    group: ["author"],
    attributes: [
      "author",
      [fn("sum", col("likes")), "likes"],
      [fn("count", col("author")), "articles"],
    ],
    order: [["likes", "DESC"]],
  });
  res.status(200).json(authors);
});

module.exports = router;
