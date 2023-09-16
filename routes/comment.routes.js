const express = require('express');
const commentRouter = express.Router();

const { findById, getAll, add, edit, findByIssueId, findBySprintId, findByPreviousComment, deleteByIssue, deleteBySprint, remove } = require('../controllers/comment.controllers');

commentRouter.post('/add', add);
commentRouter.get('/list', getAll);
commentRouter.get('/findById', findById);
commentRouter.get('/findByIssueId', findByIssueId);
commentRouter.get('/findBySprintId', findBySprintId);
commentRouter.get('/findByPreviousComment', findByPreviousComment);
commentRouter.put('/update', edit);
commentRouter.delete('/delete', remove);
commentRouter.delete('/deleteByIssue', deleteByIssue);
commentRouter.delete('/deleteBySprint', deleteBySprint);

module.exports = commentRouter;