const ProjectModel = require('../models/project.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const generateProjectCode = (req, res, next) => {
    function processString(name) {
        const today = new Date().toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '');
      
        const nameParts = name.split(' ');
      
        if (nameParts.length === 1) {
          return nameParts[0].slice(0, 4).toUpperCase() + today;
        } else {
          const initials = nameParts.map(part => part[0].toUpperCase()).join('');
          return initials.slice(0, 3) + today;
        }
    }
    
    req.body.code = processString(req.body.name);
    next();
}

const add = async (req, res) => {
    const project = await ProjectModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'New project created', project })
};

const getAll = async(req, res) => {
    const projects = await ProjectModel.find({})
    res.status(StatusCodes.OK).json({ nbHits: projects.length, projects })
};

const findByName = async(req, res) => {
    const {name} = req.query;
    const project = await ProjectModel.find({name});
    if (!project) {
        throw new BadRequestError(`Project not found!`);
    }
    res.status(StatusCodes.OK).json({ project });
};

const findById = async(req, res) => {
    const projectId = req.query.id;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
        throw new BadRequestError(`Project not found!`);
    }
    res.status(StatusCodes.OK).json({ project });
};

const findByCode = async(req, res) => {
    const projectCode = req.query.code;
    const project = await ProjectModel.findOne({code: projectCode});
    if (!project) {
        throw new BadRequestError(`Project not found!`);
    }
    res.status(StatusCodes.OK).json({ project });
};

const remove = async(req, res) => {
    const projectId = req.query.id;
    const deletedProject = await ProjectModel.findByIdAndRemove({ _id: projectId});

    if (!deletedProject) {
        throw new NotFoundError(`Project with id ${projectId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Project deleted'})
};

const edit = async(req, res) => {
    const projectId = req.query.id;
    var project = await ProjectModel.findByIdAndUpdate(projectId, req.body);
    if (!project) {
        throw new NotFoundError(`Project not found!`);
    }
    var updatedProject = await ProjectModel.findById(project._id);
    res.status(StatusCodes.OK).json({ message: 'Project updated', updatedProject })
};

module.exports = { findByCode, generateProjectCode, add, getAll, edit, findById, findByName, remove };