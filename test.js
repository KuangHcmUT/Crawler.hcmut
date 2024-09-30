const cheerio = require('cheerio');
const axios = require("axios");
// const request = require('request-promise');
const fs = require('fs'); 

const index = 1;
const folderPath = './data';
// const authToken = 'xke2atlmh5mgxgz00ssflh22';


async function crawlData( url, i) {
    try {
        const dataResponse = await axios.get(url);
        const html = dataResponse.data; 
        const $ = cheerio.load(html);
        
        const extractedData = [];
        $(".fulltext").children().each((index, element) => {
            const item = $(element).text();
            let result = item.replace(/\n/g, ' ') 
            result = result.trim();
            extractedData.push(result);
            extractedData.push(item);
        });
  
        fs.writeFileSync(`${folderPath}/data${i}.txt`, extractedData.join('\n'));
        // fs.writeFileSync(`${folderPath}/data${i}.json`, JSON.stringify(extractedData));

        //download link
        // $('.fileAttack a').each((index, element) => {
        //     const link = $(element).attr('href');
        //     if(link) {
        //         if(link.includes('download')) {
        //             console.log(link);
        //             fs.writeFileSync(`${folderPath}/link${i}.txt`, link);
        //         }
        //     }
        // });

    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  crawlData('https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=32833', index+100);