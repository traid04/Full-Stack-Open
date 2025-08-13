const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');
const mongoose = require('mongoose')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todos = await redis.getAsync("added_todos");
  await redis.setAsync("added_todos", (Number(todos) || 0) + 1);
  res.send(todo);
});

const singleRouter = express.Router({ mergeParams: true });

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (req.todo) {
    return res.status(200).json(req.todo);
  }
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, req.body, { new: true, runValidators: true })
    return res.status(200).json(updatedTodo);
  }
  catch(error) {
    return res.status(400).json({ error: 'Error updating Todo' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;