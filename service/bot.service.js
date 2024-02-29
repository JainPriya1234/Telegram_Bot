const TelegramBot = require('node-telegram-bot-api');
const adminService = require('./admin.service')
const dotenv = require('dotenv');
const User = require('../model/user');
const {countryCodes} = require('./country.codes')
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
            else bot.sendMessage(chatId,'Invalid Command!\nPlease use /start to continue')
            return;
        }
        else if(!isExist.name){
            isExist.name = textMessage;
            bot.sendMessage(isExist.chatId,'Now Please Provide Your Country');
        }
        else if(!isExist.country){
            if(countryCodes.hasOwnProperty(textMessage.toLowerCase())){
                isExist.country = countryCodes[textMessage.toLowerCase()];
                bot.sendMessage(isExist.chatId,'Your City Please ^_^');
            }
            else bot.sendMessage(isExist.chatId,'Incorrect Country!')
        }
        else if(!isExist.city){
            isExist.city = textMessage;
            isExist.isActive = true;
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
        // Fetch Location
        await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${users[i].city},${users[i].country}&limit=1&appid=${process.env.WEATHER_API}`)
        .then((res)=>{
            if(res.ok) return res.json();
        })
        // fetch Weather 
        .then(async(getLocation)=>{
            await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getLocation[0].lat}&lon=${getLocation[0].lon}&appid=${process.env.WEATHER_API}`)
            .then((res)=>{ if(res.ok) return res.json() })
            .then(async(data)=>{
                const report = `Your Weather Report 🌤\nCurrent Weather:${data.weather[0].main}\nDescription : ${data.weather[0].description}\nTemprature : ${(data.main.temp - 273.15).toFixed(2)} C\nVisibility:${data.visibility}\nWind Speed : ${data.wind.speed}`
                await bot.sendMessage(users[i].chatId,report)
            })
        })
        .catch((err)=>{console.log(err); bot.sendMessage(users[i].chatId,'Cannot Fetch Weather Report of City/Country\nPlease Update!')})
    }
}

module.exports = {sendMessageToUsers}