const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// TASKS
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    return res.send(req.user.tasks);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id;

  try {
    // const task = await Task.findById(taskId);
    const task = await Task.findOne({ _id: taskId, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (error) {
    return res.status(500).send();
  }
});

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    return res.status(201).send(task);
  } catch (error) {
    return res.status(400).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.state(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    // const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
