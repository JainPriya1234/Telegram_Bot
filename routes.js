const express = require('express');
const router = express.Router();
const {getUser, getUserById, deactivateUserById, updateMessageFrequency, updateApiKey} = require('./service/admin.service')

router.get("/", (req, res) => {
    res.send("API  is running!!!");
});

// Get user details
router.get('/getuser',getUser);
router.get('/getuser/:id',getUserById);

// Block User
router.delete('/user/deactivate/:id',deactivateUserById)

// Update Message Frequncy
router.post('/frequency',updateMessageFrequency)

// Update Weather API key
router.post('/update-apikey',updateApiKey)






module.exports = router;