const express = require('express');
const issueRouter = express.Router();

const { findById, getAll, add, edit, findByProjectId, remove } = require('../controllers/issue.controllers');

issueRouter.post('/add', add);
issueRouter.get('/list', getAll);
issueRouter.get('/findById', findById);
issueRouter.get('/findByProjectId', findByProjectId);
issueRouter.put('/update', edit);
issueRouter.delete('/delete', remove);

module.exports = issueRouter;