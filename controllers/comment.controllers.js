const CommentModel = require('../models/comment.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const add = async (req, res) => {
    const comment = await CommentModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Added', comment })
};

const getAll = async(req, res) => {
    const comments = await CommentModel.find({})
    res.status(StatusCodes.OK).json({ nbHits: comments.length, comments })
};

const findById = async(req, res) => {
    const commentId = req.query.id;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
        throw new BadRequestError(`Comment not found!`);
    }
    res.status(StatusCodes.OK).json({ comment });
};

const findByIssueId = async(req, res) => {
    const comments = await CommentModel.find({ issue: req.query.issue });
    res.status(StatusCodes.OK).json({ comments });
};

const findBySprintId = async(req, res) => {
    const comments = await CommentModel.find({ issue: req.query.sprint });
    res.status(StatusCodes.OK).json({ comments });
};

const findByPreviousComment = async(req, res) => {
    const comments = await CommentModel.find({ previousComment: req.query.previousComment });
    res.status(StatusCodes.OK).json({ comments });
};

const remove = async(req, res) => {
    const commentId = req.query.id;
    const deletedcomment = await CommentModel.findByIdAndRemove({ _id: commentId});

    if (!deletedcomment) {
        throw new NotFoundError(`Comment with id ${commentId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Comment deleted'})
};

const deleteByIssue = async (req, res) => {
    const deleted = await CommentModel.deleteMany({ issue : req.query.issue });
    res.status(StatusCodes.OK).json({ message: 'Comments deleted'})
};

const deleteBySprint = async (req, res) => {
    const deleted = await CommentModel.deleteMany({ sprint : req.query.sprint });
    res.status(StatusCodes.OK).json({ message: 'Comments deleted'})
};

const edit = async(req, res) => {
    const commentId = req.query.id;
    // Join request before updating
    const request = await CommentModel.findByIdAndUpdate({ _id: commentId}, req.body);
    const updatedcomment = await CommentModel.findById(request._id);

    if (!updatedcomment) {
        throw new NotFoundError(`Join request not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Updated', comment: updatedcomment})
};

module.exports = { add, getAll, edit, findByIssueId, findBySprintId, findByPreviousComment, findById, remove, deleteByIssue, deleteBySprint }