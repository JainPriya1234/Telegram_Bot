const TelegramBot = require('node-telegram-bot-api');
const adminService = require('./admin.service')
const dotenv = require('dotenv');
const User = require('../model/user');
dotenv.config()

const token = process.env.TELEGRAM_API
const bot = new TelegramBot(token, { polling: true });
bot.on('message',async(msg)=>{
    try{
        const chatId = msg.chat.id;
        const isExist = await User.findOne({chatId:chatId});
        const textMessage = msg.text;
        if(!isExist){                             // For New User
            if(textMessage === '/start'){
                bot.sendMessage(chatId,'Welcome! \nPlease Provide Your Name');
                await User.create({chatId:chatId})
            }
            else bot.sendMessage(chatId,'Invalid Command!\nPlease use /Start to continue')
            return;
        }
        else if(!isExist.name){
            isExist.name = textMessage;
            bot.sendMessage(isExist.chatId,'Now Please Provide Your Country');
        }
        else if(!isExist.country){
            isExist.country = textMessage;
            bot.sendMessage(isExist.chatId,'Your City Please ^_^');
        }
        else if(!isExist.city){
            isExist.city = textMessage;
            bot.sendMessage(isExist.chatId,'Thankyou for your details, we will keep in touch with you with our weather reports');
        }
        else{
            if(textMessage.startsWith('/help')){
                console.log(textMessage);
                bot.sendMessage('Thankyou, we will resolve your issue');
            }
            else bot.sendMessage(chatId,'Details already saved!\n for any update/query please use /help and write your query')
        }
        await isExist.save();
    }
    catch(err){
        console.log(err)
    }
})

/**
 * @description Send Message to All Active users
 */
const sendMessageToUsers = async()=>{
    const users = await User.find({isActive:true});
    for(let i = 0; i < users.length; i++){
        await bot.sendMessage(users[i].chatId,"Today's Weather Report\n")
    }
}

module.exports = {sendMessageToUsers}