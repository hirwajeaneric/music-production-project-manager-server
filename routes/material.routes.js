const express = require('express');
const materialRouter = express.Router();

const { findById, getAll, add, attachFile, edit, remove, upload, findByProjectId } = require('../controllers/material.controllers');

// materialRouter.post('/add', upload.single('picture'), attachFile, add);
materialRouter.post('/add', add);
materialRouter.get('/list', getAll);
materialRouter.get('/findById', findById);
materialRouter.put('/update', edit);
materialRouter.delete('/delete', remove);
materialRouter.get('/findByProjectId', findByProjectId);

module.exports = materialRouter;