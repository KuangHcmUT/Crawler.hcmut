const cheerio = require("cheerio");
const axios = require("axios");
// const request = require('request-promise');
const fs = require("fs");

const index = 1;
const folderPath = "./data";
const authToken = "xke2atlmh5mgxgz00ssflh22";

const content = {};
const details = [];
const header = [];
const mainContext = [];
const footer = [];

let chuongNum = 0;
let top = {};
let khoan = {};
let diem = {};

let para = 0;
let lv = 0;
let pre = 0;

const chuongRegex = /^Chương (I{1,3}|IV|V|VI{0,3}|IX|X)\b/;
const mucRegex = /^Mục (\d+)\./;
const dieuRegex = /^Điều (\d+)\./;
const khoanRegex = /^(\d+)\./;
const diemRegex = /^([a-zA-Z])\)/;

var num;
var matches;
var dotIdx;
var closeIdx;
var detail;

async function fetchAsync(url, i) {
    const pageHTML = await axios.get(url);
    const $ = cheerio.load(pageHTML.data);

    $("#tab1 p").each((index, element) => {
        let paras = $(element).text();
        paras = paras.replace(/\n/g, " ");
        paras = paras.trim();

        if (paras !== "Video Pháp Luật" && para <= 2) {
            // stop at video phap luat section
            checkingLine(paras);
        }
    });

    content.details = details;
    content.header = header;
    content.mainContext = mainContext;

    // fs.writeFileSync(`${folderPath}/data${i}.json`, JSON.stringify(content));
    fs.writeFileSync(`${folderPath}/data${i}.json`, content);

    console.log("Data has been written to data.json");
}

function checkingLine(line) {
    if (chuongRegex.test(line)) {
        para = 2;
        pre = lv;
        lv = 1;
    } else if (mucRegex.test(line)) {
        pre = lv;
        lv = 2;
    } else if (dieuRegex.test(line)) {
        pre = lv;
        lv = 3;
    } else if (khoanRegex.test(line)) {
        pre = lv;
        lv = 4;
    } else if (diemRegex.test(line)) {
        pre = lv;
        lv = 5;
    } else if (line == "") {
        para = para + 1;
        if (para == 3) {
            return
        }
        console.log(para);
    } else {
        pre = lv;
        lv = 0;
    }

    //check lv from 0 to 5
    switch (lv) {
        case 1: //Chuong
            chuongNum = chuongNum + 1;
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            }
            if (Object.keys(khoan).length !== 0) {
                top.content.push(khoan);
                khoan = {};
            }
            if (Object.keys(top).length !== 0) {
                mainContext.push(top);
                top = {};
            }
            matches = line.match(chuongRegex);
            num = matches[1];
            top = {
                name: "chuong" + num,
                title: line,
                content: [],
            };
            break;
        case 2: //Muc
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            }
            if (Object.keys(khoan).length !== 0) {
                top.content.push(khoan);
                khoan = {};
            }
            mainContext.push(top);
            top = {};
            matches = line.match(mucRegex);
            num = matches[1];
            top = {
                name: "muc" + num,
                chapter: chuongNum,
                title: line,
                content: [],
            };
            dotIdx = line.indexOf(".");
            detail = line.slice(dotIdx + 2);
            top.content.push(detail);
            // top.content.push(khoan);
            break;
        case 3: //Dieu
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            }
            if (Object.keys(khoan).length !== 0) {
                top.content.push(khoan);
                khoan = {};
            }
            mainContext.push(top);
            top = {};
            matches = line.match(dieuRegex);
            num = matches[1];
            top = {
                name: "dieu" + num,
                title: line,
                content: [],
            };
            dotIdx = line.indexOf(".");
            detail = line.slice(dotIdx + 2);
            top.content.push(detail);
            break;
        case 4: //Khoan
            console.log(line)
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            }
            if (Object.keys(khoan).length !== 0) {
                top.content.push(khoan);
                khoan = {};
            }
            matches = line.match(khoanRegex);
            num = matches[1];
            khoan = {
                name: "khoan" + num,
                title: line,
                content: [],
            };
            dotIdx = line.indexOf(".");
            detail = line.slice(dotIdx + 2);
            khoan.content.push(detail);
            diem = {};
            break;
        case 5: //Diem
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            }
            matches = line.match(diemRegex);
            num = matches[1];
            diem = {
                name: "diem" + num,
                title: line,
                content: [],
            };
            closeIdx = line.indexOf(")");
            detail = line.slice(closeIdx + 2);
            diem.content.push(line);
            break;
        default:
            if (para == 0) {
                details.push(line);
            } else if (para == 1) {
                header.push(line);
            } else if (para == 2) {
                if (pre == 1) {
                    //Chuong
                    top.content.push(line);
                } else if (pre == 2) {
                    //Muc
                    top.content.push(line);
                } else if (pre == 3) {
                    //Dieu
                    top.content.push(line);
                } else if (pre == 4) {
                    //Khoan
                    khoan.content.push(line);
                } else if (pre == 5) {
                    //Diem
                    diem.content.push(line);
                }
            } else {
                return;
                footer.push(line);
            }

            break;
    }
}

// fetchAsync("https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=32801", index + 10)
fetchAsync(
    "https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Nghi-dinh-19-2024-ND-CP-sua-doi-Nghi-dinh-48-2019-ND-CP-quan-ly-phuong-tien-vui-choi-duoi-nuoc-599548.aspx",
    index
);
// login("khtc_vietrade", "xttm2022");
