const fs = require("fs");

/* inputs */

const fieldVal = "git+https://github.com/kugesh-Rajasekaran/query-json.git";
const conditions = {
  name: { value: "query-json", condition: "equal" },
  start: { value: "node test-1", condition: "equal" },
};
const folderLoc = "./json-files-large";

/**********/
const stTime = new Date();
const result = {};
/* list of file names */
const lofn = fs.readdirSync(folderLoc);
const noOfFiles = lofn.length;
const promises = [];
const conditionKeys = Object.keys(conditions);
const successCounter = [];
let itr;
for (itr = 0; itr < noOfFiles; itr++) {
  promises[itr] = performJsonSearch(itr); //.then((val) => console.log(`Finished -> ${itr}`)).catch((err) => { console.log(`Errored -> ${itr}`) } );
}

async function performJsonSearch(itr) {
  const fileName = lofn[itr];
  const fileLoc = `${folderLoc}/${fileName}`;
  const fileContent = fs.readFileSync(fileLoc, "utf-8");
  const jsonObj = JSON.parse(fileContent);
  const targetValFound = isValExist(Object.values(jsonObj));
  if (targetValFound) result[itr] = fs.statSync(fileLoc).size;
  else {
    successCounter[itr] = 0;
    const conditionSatisfied = isCondSatisfy(
      Object.keys(jsonObj),
      jsonObj,
      itr
    );
    if (conditionSatisfied) result[itr] = fs.statSync(fileLoc).size;
  }
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

Promise.all(promises).then((val) => console.log(result, stTime, new Date(), stTime - new Date()));

//   fs.readFile(fileLoc, "utf-8", (err, jsonStr) => {
//     if (err) return console.log(err);
//     const jsonObj = JSON.parse(jsonStr);
//     const targetValFound = isValExist(Object.values(jsonObj));
//     if (targetValFound) result[fileName] = fs.statSync(fileLoc).size;

//     // const condSatisfied = isCondSatisfied(Object.keys(jsonObj));
//     // if(condSatisfied)
//     //     result[fileName] = fs.statSync(`./json-files/${fileName}`).size;
//     console.log(result);
//   });
