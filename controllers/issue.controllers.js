const IssueModel = require('../models/issue.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const projectModel = require('../models/project.model');

const add = async (req, res) => {
    const issue = await IssueModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Added', issue })
};

const getAll = async(req, res) => {
    const issues = await IssueModel.find({})
    res.status(StatusCodes.OK).json({ nbHits: issues.length, issues })
};

const findById = async(req, res) => {
    const issueId = req.query.id;
    const issue = await IssueModel.findById(issueId);
    if (!issue) {
        throw new BadRequestError(`Issue not found!`);
    }
    res.status(StatusCodes.OK).json({ issue });
};

const findByProjectId = async(req, res) => {
    const { project } = req.query;
    const issues = await IssueModel.find({ project: project });
    res.status(StatusCodes.OK).json({ issues });
};

const remove = async(req, res) => {
    const issueId = req.query.id;
    const deletedissue = await IssueModel.findByIdAndRemove({ _id: issueId});

    if (!deletedissue) {
        throw new NotFoundError(`Issue with id ${issueId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'issue deleted'})
};

const edit = async(req, res) => {
    const issueId = req.query.id;
    
    var projectIssues = [];
    var numberOfAllIssues = 0;
    var numberOfCompletedIssues = 0;
    var projectProgress = 0;
    var updatedProject = {};

    // 1. Fetch previous issue 
    var previousIssue = await IssueModel.findById(issueId);

    var projectOfThisIssue = previousIssue.project; 

    // 2. Normal issue update
    const request = await IssueModel.findByIdAndUpdate({ _id: issueId}, req.body);
    const updatedissue = await IssueModel.findById(request._id);

    // Update the project progress as well.
    // Updating the project progress when ever an issue's progress is updated.
        
    // 3. Compare the previous issue progress to the updated one
    if (updatedissue.progress !== previousIssue.progress) {
        
        // 1. Fetch all issues of the same project 
        projectIssues = await IssueModel.find({ project: projectOfThisIssue});
        numberOfAllIssues = projectIssues.length;
        
        // 2. Get the number of completed issues 
        let completedIssues = projectIssues.filter(element => element.progress === 'Completed')
        numberOfCompletedIssues = completedIssues.length;
        
        // 3. Make a calculation of progress according to the given numbers
        projectProgress = numberOfCompletedIssues * 100 / numberOfAllIssues;
        updatedProject = await projectModel.findByIdAndUpdate({ _id: projectOfThisIssue }, { progress: projectProgress });
    }

    if (!updatedProject) {
        throw new BadRequestError('Failed to update project progress!');
    }

    res.status(StatusCodes.OK).json({ message: 'Updated', issue: updatedissue})
};

module.exports = { add, getAll, edit, findByProjectId, findById, remove }