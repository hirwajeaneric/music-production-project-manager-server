const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const sendEmail = require('../utils/email/sendEmail');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            alias: user.alias,
            phone: user.phone,
            role: user.role,
            group: user.group,
            token
        }
    })
};

const signUp = async (req, res) => {
    // Checking if the user is not already registered
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
        res.status(StatusCodes.BAD_REQUEST).send({ msg: `User with the provide email already exists.` });
    }

    // Validate password
    const schema = Joi.object({
        password: passwordComplexity().required().label('Password'),
    })
    const {error} = schema.validate({password: req.body.password});
    if (error) { return res.status(StatusCodes.BAD_REQUEST).send({ msg: error.details[0].message }) }
    
    // Registering the user
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            alias: user.alias,
            phone: user.phone,
            role: user.role,
            group: user.group,
            token
        }
    })
};

const createAccountForUser = async (req, res) => {
    var newPassword = req.body.password;
    // Checking if the user is not already registered
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
        res.status(StatusCodes.CREATED).json({
            user: {
                id: userExists._id,
                email: userExists.email,
                fullName: userExists.fullName,
                role: userExists.role,
                group: userExists.group,
            }
        })
    } else {
        // Validate password
        const schema = Joi.object({
            password: passwordComplexity().required().label('Password'),
        })
        const {error} = schema.validate({ password: req.body.password });
        if (error) { return res.status(StatusCodes.BAD_REQUEST).send({ msg: error.details[0].message }) }

        // Registering the user
        const user = await User.create({...req.body});

        res.status(StatusCodes.CREATED).json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                password: newPassword,
                group: user.group,
            }
        })
    }
};

const getUsers = async(req, res, next) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).json({ nbHits: users.length, users })
};

const findById = async(req, res, next) => {
    const userId = req.query.id;
    const user = await User.findById(userId)

    if (!user || user === null ) {
        throw new NotFoundError(`No user with ID: ${userId} found!`);
    }

    res.status(200).json({ user });
};

const findByEmail = async(req, res, next) => {
    const userEmail = req.query.email;
    const users = await User.findOne({ email: userEmail })
    
    if (!users || users.length === 0 ) {
        throw new NotFoundError(`No user with email ${userEmail}`);
    }
    
    res.status(200).json({ users });
};

const findByUserType = async(req, res, next) => {
    const role = req.query.role;
    const users = await User.findOne({ role: role })
    
    if (!users || users.length === 0 ) {
        throw new NotFoundError(`No user with type ${role}`);
    }
    
    res.status(200).json({ users });
};


const updateUser = async(req, res, next) => {
    const user = await User.findByIdAndUpdate({ _id: req.query.id }, req.body);
    const updatedUser = await User.findById(user._id);

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        message: "Account updated!",
        user: {
            id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            alias: updatedUser.alias,
            phone: updatedUser.phone,
            role: updatedUser.role,
            group: updatedUser.group,
            token
        }
    })
};

const requestPasswordReset = async(req, res, next) => {
    const { email } = req.body;
    if (!email) {throw new BadRequestError('Your email is required')} 
    
    const registeredUser = await User.findOne({ email: email });
    if (!registeredUser) { throw new BadRequestError('Email address unrecognized');}
  
    let token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: 1800 }); 
    
    let clientDomain = '';

    let link = `http://${clientDomain || 'localhost'}:5000/auth/reset-password/${token}/${registeredUser._id}`;

    await sendEmail(
        registeredUser.email,
        "Reset password",
        link
    );

    res.status(StatusCodes.OK).json({ message: `Password reset link sent to your email: ${registeredUser.email}`})   
}

const resetPassword = async(req, res, next) => {
    const password = req.body.password;
    
    const user = await User.findById(req.query.id);
    if (!user) { throw new BadRequestError('Invalid or expired link')}
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) { throw new UnauthenticatedError('Invalid authentication') }
    
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) { throw new UnauthenticatedError('Invalid or expired link')}

    // Validating the password using Joi and Join Password Complexity
    const schema = Joi.object({
        password: passwordComplexity().required().label('Password'),
    })
    const {error} = schema.validate(req.body);
    if (error) { return res.status(StatusCodes.BAD_REQUEST).send({ msg: error.details[0].message }) }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate({_id: req.query.id}, { password: hashedPassword });    

    if (!updatedUser) {
        throw new UnauthenticatedError('Unable to change password');
    } else {
        res.status(StatusCodes.OK).json({ message: "Password changed" })
    }
}

const deleteAccount = async(req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.query.id);
    
    if (!deletedUser) {
        throw new NotFoundError(`Failed to delete account.`);
    }
    
    res.status(StatusCodes.OK).json({ message: "Account deleted!" });
};

module.exports = { signIn, signUp, createAccountForUser, requestPasswordReset, findByEmail, findByUserType, resetPassword, getUsers, findById, updateUser, deleteAccount }
