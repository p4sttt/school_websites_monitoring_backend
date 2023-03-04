const schedule = require("node-schedule");
const { default: axios } = require("axios");

const Website = require("./models/Website");
const { sendNotify } = require("./telegramBot");

module.exports = schedule.scheduleJob("*/30 * * * * *", async () => {
  const websites = await Website.find({});
  for (let website of websites) {
    const { url, _id } = website;
    const isAccessibleLast = website.isAccessible;
    await axios
      .get(url)
      .then(async () => {
        website.isAccessible = true;
        await website.save();
        if (isAccessibleLast == false) {
          sendNotify(website);
        }
      })
      .catch(async () => {
        website.isAccessible = false;
        await website.save();
        if (isAccessibleLast == true) {
          sendNotify(website);
        }
      });
  }
});
