const paymentModel = require('../models/payment.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const multer= require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './payments') },
    filename: (req, file, callback) => { callback(null, `payment-${file.originalname}`) }
})

// const multerFilter = (req, file, callback) => {
//     if (file.mimetype.startsWith("image")) {
//         callback(null, true);
//     } else {
//         callback("Not an image! Please upload only images.", false);
//     }
// };

const upload = multer({ 
    storage: multerStorage,
    // fileFilter: multerFilter 
});

const attachFile = async (req, res, next) => {
    if (req.file) {
        req.body.attachment = req.file.filename;
        next();
    } else {
        next();
    }
}

const add = async (req, res) => {
    const payment = await paymentModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Added', payment })
};

const getAll = async(req, res) => {
    const payments = await paymentModel.find({})
    res.status(StatusCodes.OK).json({ nbHits:  payments.length, payments })
};

const findById = async(req, res) => {
    const paymentId = req.query.id;
    const payment = await paymentModel.findById( paymentId);
    if(!payment){
        throw new BadRequestError(`payment not found!`)
    }
    res.status(StatusCodes.OK).json({ payment })
};

const findByProjectId = async(req, res) => {
    const { project } = req.query;
    const payments = await paymentModel.find({ project: project });
    res.status(StatusCodes.OK).json({ nbHits:  payments.length,  payments });
};

const edit = async(req, res) => {
    const paymentToBeUpdated = req.body;
    const { id } = req.query;

    const updated = await paymentModel.findByIdAndUpdate({ _id: id }, paymentToBeUpdated);
    
    const updatedpayment = await paymentModel.findById(updated._id);
    res.status(StatusCodes.OK).json({ message: 'Updated', payment: updatedpayment })
};

const remove = async(req, res) => {
    const paymentId = req.query.id;
    const deletedpayment = await paymentModel.findByIdAndRemove({ _id: paymentId});

    if (!deletedpayment) {
        throw new NotFoundError(`payment with id ${paymentId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Deleted'})
};

module.exports = { add, getAll, findById, findByProjectId, edit, upload, attachFile, remove }
