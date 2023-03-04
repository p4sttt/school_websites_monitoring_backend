const TelegramApi = require("node-telegram-bot-api");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Website = require("./models/Website");
const User = require("./models/User");

const bot = new TelegramApi(process.env.TELEGRAM, { polling: true });
console.log("bot working");

bot.setMyCommands([
  { command: "/start", description: "Начало работы" },
  { command: "/websites", description: "Доступность сайтов" },
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
    "**Добро пожаложвать!**\n \nНапишите `/auth Email Password` чтобы авторизоваться\n \nИли просто напишите `/websites` чтобы посмотреть информация о работоспособности сайтов",
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
    parse_mode: "Markdown",
  });
}

async function auth(chat, text) {
  const email = text.split(" ")[1];
  const password = text.split(" ")[2];
  const user = await User.findOne({ email: email });
  if (!user) {
    return await bot.sendMessage(chat.id, "Такого пользователя не существует");
  }
  if (user.telegramChatId != null) {
    return await bot.sendMessage(
      chat.id,
      "У этого пользователя уже подключен telegram"
    );
  }
  const hashPassword = user.password;
  const validPassword = bcrypt.compareSync(password, hashPassword);
  if (!validPassword) {
    return await bot.sendMessage(chat.id, "Неверный логин или пароль");
  }
  user.telegramChatId = chat.id;
  await user.save();
  await bot.sendMessage(chat.id, "Авторизация прошла успешно");
  return await bot.sendMessage(
    chat.id,
    "Теперь вы будете получать уведомленя, если сайт одного из ВУЗов перестанет работать\n \nЧтобы отказаться от оповещений напишите `/cancelnotifications`",
    { parse_mode: "Markdown" }
  );
}

async function cancelnotifications(chat) {
  const user = await User.findOneAndUpdate({ telegramChatId: chat.id });
  if (!user) {
    return await bot.sendMessage(
      caht.id,
      "Аккаунт пользователя не подключен, что бы это сделать воспользуйтесь командой `/auth Email Password`"
    );
  }
  if (user.notifications) {
    user.notifications = false;
    await user.save();
    return await bot.sendMessage(chat.id, "Уведомления успешно отключены");
  } else {
    return await bot.sendMessage(chat.id, "Уведомления уже отключены");
  }
}

async function setnotifications(chat) {
  const user = await User.findOne({ telegramChatId: chat.id });
  if (!user) {
    return await bot.sendMessage(
      caht.id,
      "Аккаунт пользователя не подключен, что бы это сделать воспользуйтесь командой `/auth Email Password`"
    );
  }
  if (!user.notifications) {
    user.notifications = true;
    await user.save();
    return await bot.sendMessage(chat.id, "Уведомления успешно включены");
  } else {
    return await bot.sendMessage(chat.id, "Уведомления уже включены");
  }
}

bot.on("message", (msg) => {
  const { text, chat } = msg;
  if (text === "/start") {
    start(chat);
  }
  if (text === "/websites") {
    websites(chat);
  }
  if (text.split(" ")[0] === "/auth") {
    auth(chat, text);
  }
  if (text === "/cancelnotifications") {
    cancelnotifications(chat);
  }
  if (text === "/setnotifications") {
    setnotifications(chat);
  }
});

async function sendNotify(website) {
  const users = await User.find({});
  for (let user of users) {
    if (
      user.telegramChatId == null ||
      user.notifications == false ||
      user.blockedSites.includes(website)
    ) {
      return 0;
    }
    if (website.isAccessible) {
      await bot.sendSticker(
        user.telegramChatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/192/22.webp"
      );
      return await bot.sendMessage(
        user.telegramChatId,
        `Сайт [${website.title}](${website.url}) возобновил свою работу`,
        { parse_mode: "Markdown" }
      );
    } else {
      await bot.sendSticker(
        user.telegramChatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/23.webp"
      );
      return await bot.sendMessage(
        user.telegramChatId,
        `К сожалению сайт [${website.title}](${website.url}) временно недоступен`,
        { parse_mode: "Markdown" }
      );
    }
  }
}

module.exports = { sendNotify };
