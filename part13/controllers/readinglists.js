const { Bloglist } = require('../models/index');
const express = require('express');
const router = express.Router();
const tokenExtractor = require('../util/middleware');

router.post('/', async (req, res, next) => {
    const toRead = req.body;
    try {
        const response = await Bloglist.create(toRead);
        res.status(201).json(response);
    }
    catch(error) {
        next(error);
    }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
    const id = req.params.id;
    let blog = await Bloglist.findByPk(id);
    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: "The blog is not on this user's reading list" });
    }
    blog.read = req.body.read;
    try {
        await blog.save();
        return res.status(200).json(blog);
    }
    catch(error) {
        next(error);
    }
});

module.exports = router;