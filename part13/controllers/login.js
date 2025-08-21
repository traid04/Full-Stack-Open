const { User, Session } = require('../models/index');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { SECRET } = require('../util/config');

router.post('/', async (req, res, next) => {
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    });
    const password = req.body.password;
    if (!(user && password === 'secret')) {
        return res.status(400).json({ error: 'invalid credentials' });
    }
    const userForToken = {
        username: user.username,
        name: user.name,
        id: user.id
    };
    const token = jwt.sign(userForToken, SECRET);
    await Session.create({ token, username: user.username, name: user.name, user_id: user.id });
    res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = router;