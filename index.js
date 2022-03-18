const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options');
const token = '5278587444:AAHesmGYwMsyjUC-etB8LW_MC43il-R9Wu4'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты попробуй угадай, если не угадаешь я оформлю на тебя мой кредит! \nПопытка не пытка, но помни как Юлий проиграл два полцарства', gameOptions);
    chats[chatId] = Math.floor(Math.random() * 10);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Твои персональные данные уже у меня'},
        {command: '/game', description: 'Какая-то игра непонятная'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ec5/c1b/ec5c1b75-12ea-45bd-aa7b-33491089b8e5/6.webp');
            return bot.sendMessage(chatId, `Ну здарова, ${msg.from.first_name}`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        console.log(msg);
        return bot.sendMessage(chatId, 'Ты чё несешь??? Нормальную команду выбери!!!');
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (Number(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `Жулик ты удагал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Жаль но вы проиграли, встерчаемся завтра в банке бери с собой паспорт я загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();
