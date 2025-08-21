const Blog = require("./blog");
const User = require("./user");
const Bloglist = require("./bloglist");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: Bloglist, as: "readingList" });
User.belongsToMany(Blog, { through: Bloglist, as: "readings" });

module.exports = {
  Blog,
  User,
  Bloglist,
  Session
};
