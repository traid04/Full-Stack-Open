const { User, Blog } = require("../models/index");
const express = require("express");
const router = express.Router();

const getUser = async (req, res, next) => {
  try {
    let where = {};
    const username = req.params.username;
    if (req.query.read) {
      where = {
        read: req.query.read === "true"
      }
    }
    const user = await User.findOne({
      where: {
        username,
      },
      include: [
        {
          model: Blog,
          as: "readings",
          attributes: ["id", "title", "url", "author", "likes", "year"],
          through: {
            attributes: ["read", "id"],
            where
          },
        },
      ],
    });
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["id"] },
      include: {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:username", getUser, async (req, res, next) => {
  res.status(200).json(req.user);
});

router.put("/:username", getUser, async (req, res, next) => {
  if (req.user) {
    req.user.username = req.body.username;
    try {
      const newUser = await req.user.save();
      return res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
