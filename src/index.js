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

let asyncTranslate=(text,to)=>new Promise(((resolve, reject) => {
    translate.translate(text,{to},(err,res)=>{
        if(err)
            reject(err);
        else resolve(res.text[0])
    })
}));
async function process(data){
    let keys = Object.keys(data);
    let values = Object.values(data);
    let res = {};
    for (let j = 0; j < values.length; j++) {
        let value = values[j];
        if(typeof keys[j] == 'string' && keys[j].startsWith('_')){
            continue;
        }
        if(typeof value == 'object')
            res[[keys[j]]] = await process(value);
        else {
            res[[keys[j]]] = await asyncTranslate(value,lang);
        }
    }
    return res;
}
(async function translate() {
    let res = await process(data);
    res._locale = `${lang}-${lang.toUpperCase()}`;
    res._namespace = data._namespace;
    fs.writeFile(destinationFile, JSON.stringify(res,null,2), (err) => {
        if (err) {
            console.error(err);
        }
    });
})();