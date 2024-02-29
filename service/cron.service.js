const cron = require('node-cron');
const { sendMessageToUsers } = require('../service/bot.service')

let cronSchedule = '0 0 * * *';  // CronSchedule for once a day

const cronJob = cron.schedule(cronSchedule, async () => {
    console.log('Started Cron Job');
    await sendMessageToUsers();
});

const updateCronJon = (newSchedule)=>{
    try{
        cronJob.stop();
        cronSchedule = newSchedule; 
        cronJob.start();
    }
    catch(err){
        throw new Error(err)
    }
}

module.exports ={cronJob, updateCronJon}