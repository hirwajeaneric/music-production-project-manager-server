const express = require('express');
const sprintRouter = express.Router();

const { findById, getAll, add, edit, findByProjectId, findByIssueId, remove } = require('../controllers/sprint.controllers');

sprintRouter.post('/add', add);
sprintRouter.get('/list', getAll);
sprintRouter.get('/findById', findById);
sprintRouter.get('/findByProjectId', findByProjectId);
sprintRouter.get('/findByIssueId', findByIssueId);
sprintRouter.put('/update', edit);
sprintRouter.delete('/delete', remove);

module.exports = sprintRouter;