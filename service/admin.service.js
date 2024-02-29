const { createCustomError } = require('../errors/customAPIError');
const User = require('../model/user')
const cronService = require('../service/cron.service')

const getUser = async(req,res,next)=>{
    try{
        const users = await User.find();
        res.json(users).status(200);
    }
    catch(err){
        next(err);
    }
}

const getUserById = async(req,res,next)=>{
    try{
        const id = req.params.id
        const users = await User.findById(id);
        if(!users) return next(createCustomError(`User with Id ${id} Not Found`,404))
        res.json(users).status(200);
    }
    catch(err){
        next(err);
    }
}

const deactivateUserById = async(req,res,next)=>{
    try{
        const id = req.params.id
        const users = await User.findById(id);
        if(!users) return next(createCustomError(`User with Id ${id} Not Found`,404))
        await User.findByIdAndUpdate(id,{isActive:false});
        res.json('User Deactivated');
    }
    catch(err){
        next(err)
    }
}

const updateFrequency = async(req,res,next)=>{
    try{
        const schedule = req.body.schedule;
        await cronService.updateCronJon(schedule)
        res.json('Frequency Updated')
    }
    catch(err){
        return next(err)
    }
}

module.exports = {getUser,getUserById,deactivateUserById,updateFrequency}