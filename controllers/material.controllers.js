const MaterialModel = require('../models/material.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const multer= require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './materials') },
    filename: (req, file, callback) => { callback(null, `material-${file.originalname}`) }
})

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback("Not an image! Please upload only images.", false);
    }
  };

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter 
});

const attachFile = async (req, res, next) => {
    if (req.file) {
        req.body.picture = req.file.filename;
        next();
    } else {
        next();
    }
}

const add = async (req, res) => {
    req.body.totalPrice = req.body.quantity * req.body.unitPrice;
    const material = await MaterialModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Added', material })
};

const getAll = async(req, res) => {
    const materials = await MaterialModel.find({})
    res.status(StatusCodes.OK).json({ nbHits:  materials.length, materials })
};

const findById = async(req, res) => {
    const materialId = req.query.id;
    const material = await MaterialModel.findById( materialId);
    if(!material){
        throw new BadRequestError(`Material not found!`)
    }
    res.status(StatusCodes.OK).json({ material })
};

const findByProjectId = async(req, res) => {
    const { project } = req.query;
    const materials = await MaterialModel.find({ project: project });
    res.status(StatusCodes.OK).json({ nbHits:  materials.length,  materials });
};

const edit = async(req, res) => {
    const materialToBeUpdated = req.body;
    const { id } = req.query;

    const existingMaterial = await MaterialModel.findById(id);

    if (materialToBeUpdated.assigned && materialToBeUpdated.assigned !== existingMaterial.assigned) {
        materialToBeUpdated.assigned = existingMaterial.assigned+materialToBeUpdated.assigned;
    } else {
        delete materialToBeUpdated.assigned;
    }

    if (materialToBeUpdated.used && materialToBeUpdated.used !== existingMaterial.used) {
        materialToBeUpdated.used = existingMaterial.used+materialToBeUpdated.used;
    } else {
        delete materialToBeUpdated.used;
    }

    const updated = await MaterialModel.findByIdAndUpdate({ _id: id }, materialToBeUpdated);

    const updatedMaterial = await MaterialModel.findById(updated._id);
    res.status(StatusCodes.OK).json({ message: 'Updated', material: updatedMaterial })
};

const remove = async(req, res) => {
    const materialId = req.query.id;
    const deletedMaterial = await MaterialModel.findByIdAndRemove({ _id: materialId});

    if (!deletedMaterial) {
        throw new NotFoundError(`Material with id ${materialId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Deleted'})
};

module.exports = { add, getAll, findById, findByProjectId, edit, upload, attachFile, remove }
