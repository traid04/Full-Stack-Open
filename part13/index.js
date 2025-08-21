const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");
const express = require("express");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingRouter = require("./controllers/readinglists");
const logoutRouter = require("./controllers/logout");

const app = express();

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "SequelizeValidationError") {
    const messages = error.errors.map((e) => e.message);
    return response.status(400).json({ error: messages });
  }
  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.use("/api/users", usersRouter);

app.use("/api/login", loginRouter);

app.use("/api/authors", authorsRouter);

app.use("/api/readinglists", readingRouter);

app.use("/api/logout", logoutRouter);

app.use(errorHandler);

const init = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

init();
