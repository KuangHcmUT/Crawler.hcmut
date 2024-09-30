const cheerio = require("cheerio");
const axios = require("axios");
// const request = require('request-promise');
const fs = require("fs");

const index = 1;
const folderPath = "./VanBanPhapLuat";
const authToken = "xke2atlmh5mgxgz00ssflh22";

// read data.json
const data = fs.readFileSync("data.json");
const jsonData = JSON.parse(data.toString());


async function crawlData(url, name, i) {
    try {

        const dataResponse = await axios.get(url);
        const html = dataResponse.data;
        const $ = cheerio.load(html);
        let luat = "";
        const extractedData = [];

        $("#divThuocTinh h1").each((index, element) => {
            luat = $(element).text();
            luat = luat.trim();
            console.log(luat);
        });

        const divChildren = $('#tab1 .content1 div div').children();
        divChildren.each((index, element) => {
            let textValue = $(element).text();
            textValue = textValue.replace(/\n/g, " ");
            textValue = textValue.trim();
            // let textValues = $(element)


            extractedData.push(textValue);
        });

        // $("#tab1 p").each((index, element) => {
        //     const item = $(element).text();
        //     let removeNewLine = item.replace(/\n/g, " ");
        //     removeNewLine = removeNewLine.trim();
        //     if (removeNewLine !== "Video Pháp Luật") {
        //         extractedData.push(removeNewLine);
        //     }
        // });

        fs.writeFileSync(
            `${folderPath}/${name + i}.txt`,
            extractedData.join("\n")
        );

    } catch (error) {
        console.error("Error:", error);
    }
}

crawlData('https://thuvienphapluat.vn/van-ban/Thu-tuc-To-tung/Bo-luat-to-tung-dan-su-2015-296861.aspx', "cookk", index);
// crawlData('https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=32801', index+10);
