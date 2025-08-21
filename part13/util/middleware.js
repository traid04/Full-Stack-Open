const { Session, User } = require('../models/index');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization) {
    return res.status(401).json({ error: "token is missing" });
  }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authorization.substring(7);
      const session = await Session.findOne({ where: { token } });
      if (!session) {
        return res.status(401).json({ error: "session invalid" })
      }
      const decodedToken = jwt.verify(token, SECRET);
      const user = await User.findByPk(decodedToken.id);
      if (!user || user.disabled) {
        return res.status(401).json({ error: "user access revoked" });
      }
      req.decodedToken = decodedToken;
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  }
  next();
};

module.exports = tokenExtractor