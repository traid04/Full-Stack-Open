const express = require("express");
const { Blog, User } = require("../models/index");
const router = express.Router();
const { Op } = require("sequelize");
const tokenExtractor = require('../util/middleware');

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", async (req, res, next) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }
  try {
    const blogs = await Blog.findAll({
      order: [["likes", "DESC"]],
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: { exclude: ["id"] },
      },
      where,
    });
    return res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const newBlog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    return res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    return res.status(200).json(req.blog);
  } else {
    return res.status(404).json({ error: "Blog not found" });
  }
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    if (req.blog.userId === req.decodedToken.id) {
      await req.blog.destroy();
      return res.status(204).end();
    } else {
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    return res.status(404).json({ error: "Blog not found" });
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  const likes = req.body.likes;
  if (req.blog) {
    req.blog.likes = likes;
    try {
      await req.blog.save();
      return res.status(200).json(req.blog);
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(404).json({ error: "Blog not found" });
  }
});

module.exports = router;
