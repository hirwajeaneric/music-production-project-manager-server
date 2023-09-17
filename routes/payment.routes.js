const express = require('express');
const materialRouter = express.Router();

const { findById, getAll, add, attachFile, edit, remove, upload, findByProjectId } = require('../controllers/payment.controllers');

materialRouter.post('/add', upload.single('attachment'), attachFile, add);
materialRouter.get('/list', getAll);
materialRouter.get('/findById', findById);
materialRouter.put('/update', upload.single('attachment'), attachFile, edit);
materialRouter.delete('/delete', remove);
materialRouter.get('/findByProjectId', findByProjectId);

module.exports = materialRouter;