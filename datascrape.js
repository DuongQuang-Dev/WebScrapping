const puppeteer = require("puppeteer");
const FileSystem = require("fs");
global.arr = [];

const personInfor = {
  name: String,
  birth_date: String,
  position: String,
  organ: String,
  organization: String,
  Start_date: String,
};

(async () => {
  try {
    const line = "https://www.parlament.gv.at/ENGL/WWER/NR/";
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    const page = await browser.newPage();
    const url = line.split(",")[0];
    // if (!url.includes("https")) continue;
    await page.goto(url, { waitUntil: "networkidle0" });
    // await page.setViewport({
    //   width: 360,
    //   height: 640,
    // });

    const redirectURLs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".contentBlock > p > a"))
        .map((val, index) => {
          return val.href;
        })
        .join(",");
    });
    await browser.close();
    if (redirectURLs.length()) {
      const peopleInfo = redirectURLs.map(async (val, index) => {
        await page.goto(val, { waitUntil: "networkidle0" });
        let person = [],
          name,
          birth_date,
          position,
          organ,
          organization,
          Start_date;
        const restInfo = await page.evaluate(() => {
          let personCaption = document
            .querySelector("#inhalt")
            .innerText.split("-");
          let personContext = document.querySelectorAll("p,h3");
          name = personCaption[0];
          position = personCaption[1];
          Array.from(personContext).reduce((val, index) => {
            debugger;
            if (val.innerText === "Born") {
              birth_date = new Date(
                personContext[index + 1].innerText.split(",")[0]
              )
                .toISOString()
                .substr(0, 10);
            }
            if (val.innerText.includes("Party: ")) {
              organ = val.innerText.split("Party: ")[1];
            }
            if (val.innerText.includes("Address: ")) {
              organization = val.innerText.split(" ").pop();
            }
          });
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
})();
