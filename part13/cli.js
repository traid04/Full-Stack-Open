require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    blogs.forEach((blog) => {
      console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`);
    });
    await sequelize.close();
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
};

main();
