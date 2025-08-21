const express = require('express');
const router = express.Router();
const tokenExtractor = require('../util/middleware');

router.delete('/', tokenExtractor, async (req, res, next) => {
    try {
        const token = req.get("authorization").substring(7);
        await Session.destroy({ where: { token } });
        res.status(204).end();
    }
    catch(error) {
        next(error);
    }
})

module.exports = router;