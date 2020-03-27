const fs = require('fs');

const config = require('../config');

const lang = config.targetLanguage;
const sourceFile = config.sourceFile;
const destinationFile = config.destinationFile;
const key = config.apiKey;

if (!fs.existsSync(sourceFile)) {
    console.error(`file ${sourceFile} does not exist`);
    process.exit(1);
}

let fileContent = fs.readFileSync(sourceFile, 'utf8');
if (!fileContent) {
    console.error(`could not read file ${sourceFile}`);
    process.exit(1);
}

let data = {};
try {
    data = JSON.parse(fileContent);
} catch (e) {
    console.error(e);
    process.exit(1);
}

if (Object.keys(data).length === 0 && data.constructor === Object) {
    console.error('There is no data in the source file! Exiting');
    process.exit(1);
}

let translate = require('yandex-translate')(key);


let translatedData = {};

let i = Object.keys(data).length;
Object.keys(data).forEach((key) => {
    let text = data[key];
    translate
        .translate(text, { to: lang },(err,res)=>{
            if(err){
                console.error('ERROR:', err);
                translatedData[key] = text;
                i--;
                if (i <= 0) {
                    finalResult(translatedData);
                }
            }else {
                translatedData[key] = res.text[0];
                i--;
                if (i <= 0) {
                    finalResult(translatedData);
                }
            }
        });
});

function finalResult(data) {
    let jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(destinationFile, jsonData, (err) => {
        if (err) {
            console.error(err);
        }
    });
}