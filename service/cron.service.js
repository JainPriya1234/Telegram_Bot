const cron = require('node-cron');
const { sendMessageToUsers } = require('../service/bot.service')
let cronSchedule = '*/1 * * * *';
const cronJob = cron.schedule(cronSchedule, async () => {
    console.log('Started Cron Job');
    await sendMessageToUsers();
});

const updateCronJon = ()=>{
    const newSchedule = req.body.schedule; 
    cronJob.stop();
    cronSchedule = newSchedule; 
    cronJob.start();
}

module.exports ={cronJob, updateCronJon}