const { createCustomError } = require('../errors/customAPIError');
const User = require('../model/user')
const cronService = require('../service/cron.service')

/**
 * @description Get all user from the database
 * @returns List of users
 */
const getUser = async(req,res,next)=>{
    try{
        const users = await User.find();
        res.json(users).status(200);
    }
    catch(err){
        next(err);
    }
}

/**
 * @description Get user by Id
 * @param {String} Id
 * @returns Object 
 */
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

/**
 * @description Deactivate the user 
 * @param {String} Id 
 */

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
/** 
 * @description Set Cron_Job Time 
*/
const updateMessageFrequency = async(req,res,next)=>{
    try{
        const schedule = req.body.schedule;
        await cronService.updateCronJon(schedule)
        res.json('Frequency Updated')
    }
    catch(err){
        return next(err)
    }
}


module.exports = {getUser,getUserById,deactivateUserById,updateMessageFrequency}