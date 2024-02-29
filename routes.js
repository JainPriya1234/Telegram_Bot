const express = require('express');
const router = express.Router();
const {getUser, getUserById, deactivateUserById, updateFrequency} = require('./service/admin.service')

router.get("/", (req, res) => {
    res.send("API  is running!!!");
});

// Get user details
router.get('/getuser',getUser);
router.get('/getuser/:id',getUserById);

// Block User
router.get('/user/deactivate/:id',deactivateUserById)

router.post('/freqency',updateFrequency)






module.exports = router;