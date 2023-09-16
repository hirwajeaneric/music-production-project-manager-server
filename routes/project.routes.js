const express = require('express');
const projectRouter = express.Router();

const { generateProjectCode, findById, findByCode, findByName, add, remove, edit, getAll } = require('../controllers/project.controllers');

projectRouter.post('/add', generateProjectCode, add);
projectRouter.get('/list', getAll);
projectRouter.get('/findById', findById);
projectRouter.get('/findByCode', findByCode);
projectRouter.get('/findByName', findByName);
projectRouter.put('/update', edit);
projectRouter.delete('/delete', remove);

module.exports = projectRouter;