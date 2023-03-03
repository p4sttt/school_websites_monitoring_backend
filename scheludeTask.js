const schedule = require("node-schedule");
const { default: axios } = require("axios");

const Website = require("./models/Website");

module.exports = schedule.scheduleJob("*/1 * * * *", async () => {
  const websites = await Website.find({});
  for (let website of websites) {
    const { url, _id } = website;
    const isAccessibleLast = website.isAccessible;
    await axios
      .get(url)
      .then(async (res) => {
        await Website.findByIdAndUpdate(_id, {
          $set: { isAccessible: true },
        });
        if (isAccessibleLast == false) {
          console.log("сайт упал");
        }
      })
      .catch(async () => {
        await Website.findByIdAndUpdate(_id, {
          $set: { isAccessible: false },
        });
        if (isAccessibleLast == true) {
          sendNotify(university, false);
          notifyEmail(university, false);
          count += 1;
        }
      });
  }
});
