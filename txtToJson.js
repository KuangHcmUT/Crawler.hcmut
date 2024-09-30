// open file cook1.txt
const fs = require("fs");

const content = {};
// const title = [];
const details = [];
const header = [];
const mainContext = [];
const footer = [];

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

// read data from cook1.txt and
fs.readFile("cook1.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split(/\r?\n/);
    lines.forEach((line, index) => {
        if(index < 105) {
        checkingLine(line);
            
        }
    });

    // push the header, mainContext, and footer to the content object
    content.details = details;
    content.header = header;
    content.mainContext = mainContext;
    content.footer = footer;
    fs.writeFileSync('content.json', JSON.stringify(content));
});

// checkingLine funct
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
        console.log("para: ", para);
    } else {
        pre = lv;
        lv = 0;
    }

    //check lv from 0 to 5
    switch (lv) {
        case 1: //Chuong
            if (Object.keys(diem).length !== 0) {
                khoan.content.push(diem);
                diem = {};
            } 
            if (Object.keys(khoan).length !== 0) {
                top.content.push(khoan);
                khoan = {};
            }
            if (top != {}) {
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
                footer.push(line);
            }

            break;
    }
}

// save the json format to cook1.json
// run the code by typing node txtToJson.js in the terminal
