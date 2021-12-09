const fs = require('fs');
const frameOutput = require('./utils/frame-output.js');

/***    inputs  ***/

const fieldVal = "git+https://github.com/kugesh-Rajasekaran/query-json.git";
const conditions = {
  name: { value: "query-json", condition: "equal" },
  start: { value: "node test-1", condition: "equal" },
};
const folderLoc = "./json-files-large";

/*******************/

/*** Solution ***/

const stTime = new Date();
/* consist of all the resultant file names */
const result = [];
/* list of file names */
const lofn = fs.readdirSync(folderLoc);
const noOfFiles = lofn.length;
/* promises will contains all the operations  */
const promises = [];
const conditionKeys = Object.keys(conditions);
const successCounter = [];
let itr;
for (itr = 0; itr < noOfFiles; itr++) {
  promises[itr] = performJsonSearch(itr).catch((err) => { console.log(`Errored -> ${itr}`) } );
}

async function performJsonSearch(itr) {
  const fileName = lofn[itr];
  const fileLoc = `${folderLoc}/${fileName}`;
  const fileContent = fs.readFileSync(fileLoc, "utf-8");
  const resObj = { name: fileName, size: fs.statSync(fileLoc).size, isFieldValExist: false, isConditionsSatisfied: false };
  const jsonObj = JSON.parse(fileContent);
  const targetValFound = isValExist(Object.values(jsonObj));
  if (targetValFound) {
      resObj['isFieldValExist'] = true;  
      result[itr] = resObj;
  }
    successCounter[itr] = 0;
    const conditionSatisfied = isCondSatisfy(
      Object.keys(jsonObj),
      jsonObj,
      itr
    );
    if (conditionSatisfied) {
        resObj['isConditionsSatisfied'] = true; 
        result[itr] = resObj;
    };
  console.log(`FROM performJsonSearch -> ${Object.keys(result).length}`);
}

/* lok - list of keys */
function isCondSatisfy(lok, fileContent, itr) {
  if (!lok) return false;
  if (successCounter[itr] == conditionKeys.length) return true;
  const lokLen = lok.length;
  let keyItr;
  for (keyItr = 0; keyItr < lokLen; keyItr++) {
    const content = fileContent[lok[keyItr]];

    if (conditionKeys.includes(lok[keyItr])) {
      const result = applyCondition(lok[keyItr], content);
      if (result) successCounter[itr]++;
    } else if (typeof content == "object") {
      return isCondSatisfy(Object.keys(content), content, itr);
    }
  }
  if (successCounter[itr] == conditionKeys.length) return true;
  return false;
}

function applyCondition(key, content) {
  switch (conditions[key].condition) {
    case "equal":
      if (conditions[key].value == content) return true;
      return false;
      break;
    case "not-equal":
      if (conditions[key].value != content) return true;
      return false;
      break;
    case "greater-than":
      if (conditions[key].value > content) return true;
      return false;
      break;
    case "less-than":
      if (conditions[key].value < content) return true;
      return false;
      break;
    default:
      throw new Error(`Invalid command for ${key}`);
  }
}

/* lov - list of values */
function isValExist(lov) {
  if (!lov) return false;
  if (lov.includes(fieldVal)) return true;
  let itr,
    objLen = lov.length;
  for (itr = 0; itr < objLen; itr++) {
    const objProp = lov[itr],
      propType = typeof lov[itr];
    if (propType == "object") {
      const existOrNot = isValExist(Object.values(objProp));
      if (existOrNot) return true;
    }
  }
  return false;
}

Promise.all(promises).then((val) => {
    console.log(result, stTime, new Date(), stTime - new Date());
    result.sort((f, s) => f['size'] - s['size']);
    console.log(frameOutput(result));
});

