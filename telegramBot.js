const TelegramApi = require("node-telegram-bot-api");
const bcrypt = require("bcryptjs");

const Website = require("./models/Website");
const User = require("./models/User");

const bot = new TelegramApi(process.env.TELEGRAM, { polling: true });
console.log("bot working");

bot.setMyCommands([
  { command: "/start", description: "Начало работы" },
  { command: "/websites", description: "Доступность университетов" },
  { command: "/auth", description: "Авторизация" },
  { command: "/cancelnotifications", description: "Отключить оповещение" },
  { command: "/setnotifications", description: "Включить оповещение" },
]);

async function start(chat) {
  await bot.sendSticker(
    chat.id,
    "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
  );
  return await bot.sendMessage(
    chat.id,
    "**Добро пожаложвать!**\n \nНапишите `/auth Email Password` чтобы авторизоваться\n \nИли просто напишите `/websites` чтобы посмотреть информация о работоспособности ВУЗов",
    {
      parse_mode: "Markdown",
    }
  );
}

async function websites(chat) {
  const websites = await Website.find({});
  let message = "";
  for (let website of websites) {
    message =
      message +
      `Сайт: [${website.title}](${website.url})\nДоступен: ${
        website.isAccessible ? "✅" : "🚫"
      }\n \n`;
  }
  return await bot.sendMessage(chat.id, message, {
    parse_mode: "Markdown"
  })
}

bot.on("message", (msg) => {
  const { text, chat } = msg;
  if (text === "/start") {
    start(chat);
  }
  if (text === "/websites") {
    websites(chat)
  }
  if (text === "/auth") {
  }
});
