const fs = require("fs");
const frameOutput = require("./utils/frame-output.js");
console.log('Processing...');
/***    inputs  ***/
const fieldVal = "git+https://github.com/kugesh-Rajasekaran/query-json.git";    /* for task 1 - example */
/**
 * valid operators - [equal, not-equal, greater-than, less-than]
 */
const conditions = {                                                            /* for task 2 - example*/
  detail: { value: "just checking!!", condition: "not-equal" },
  start: { value: "node test-1", condition: "equal" },
  author: { value: "kugesh", condition: "equal" },
};
const folderLoc = "./json-files";           /* folder location */
/*******************/

/*** Solution ***/
const stTime = new Date();
const result = [];          /* consist of all the resultant file names */
let lofn;
try{
    lofn = fs.readdirSync(folderLoc);         /* list of file names */
} catch(e){
    throw new Error('Given file location not found')
}
const noOfFiles = lofn.length;
const promises = [];            /* promises will contains all the operation promises  */
const conditionKeys = Object.keys(conditions);
const successCounter = [];          /* to keep track of number of conditions satisfied */
let itr, promItr;
for (itr = 0, promItr = 0; itr < noOfFiles; itr++, promItr += 2) {
  performOperations(itr).then((v) => {
    promises[promItr] = v[0]();
    promises[promItr + 1] = v[1]();
  });
}

/**
 * @description This function will perform following operations,
 *                  1. Reads file content
 *                  2. Returns two asynchronous functions 
 *                      * ive - for finding the fieldValue
 *                      * ics - for checking whether the conditions are satisfied
 * @param {*} itr file number
 * @returns ive, ics
 */
async function performOperations(itr) {
  const fileName = lofn[itr];                               /* lofn - list of file names */
  const fileLoc = `${folderLoc}/${fileName}`;               /* fileLoc - file location */
  const fileContent = fs.readFileSync(fileLoc, "utf-8");
  if (!fileContent.length) return [() => {}, () => {}];
  const resObj = {
    name: fileName,
    size: fs.statSync(fileLoc).size,
    isFieldValExist: false,
    isConditionsSatisfied: false,
  };
  const jsonObj = JSON.parse(fileContent);
  const ive = async () => {                         /* ive - is value exist */
    const ph = isValExist(Object.values(jsonObj));  /*  ph - placeholder */
    if (ph) {
      resObj["isFieldValExist"] = true;
      result[itr] = resObj;
    }
  };
  const ics = async () => {                                         /* ics - is condition satisfy */
    successCounter[itr] = 0;
    const ph = isCondSatisfy(Object.keys(jsonObj), jsonObj, itr);   /*  ph - placeholder */
    if (ph) {
      resObj["isConditionsSatisfied"] = true;
      result[itr] = resObj;
    }
  };
  return [ive, ics];
}

/**
 * @description returns true if the given value is in the appropriate file content else false
 * @param {*} lov list of values from the given file
 * @returns true if given value found else false
 */
function isValExist(lov) {             
  if (!lov) return false;
  if (lov.includes(fieldVal)) return true;
  let itr,
    objLen = lov.length;
  for (itr = 0; itr < objLen; itr++) {
    const objProp = lov[itr],
      propType = typeof objProp;
    if (propType == "object") {
      const existOrNot = isValExist(Object.values(objProp));
      if (existOrNot) return true;
    }
  }
  return false;
}

/**
 * @description checks whether the conditions are satisfied in the given file content
 * @param {*} lok list of keys
 * @param {*} fileContent 
 * @param {*} itr 
 * @returns true if all the conditions satisfied, else false
 */
function isCondSatisfy(lok, fileContent, itr) {         
  if (!lok) return false;
  const lokLen = lok.length;
  let keyItr;
  for (keyItr = 0; keyItr < lokLen; keyItr++) {
    const content = fileContent[lok[keyItr]];
    if (conditionKeys.includes(lok[keyItr])) {
      const phac = applyCondition(lok[keyItr], content);            /* phac - placeholder for apply condition */
      if (phac && successCounter[itr] < conditionKeys.length)
        successCounter[itr]++;
    } else if (typeof content == "object") {
      const phics = isCondSatisfy(Object.keys(content), content, itr);      /* phics - placeholder for isCondSatisfy */
      if (phics && successCounter[itr] < conditionKeys.length)
        successCounter[itr]++;
    }
  }
  if (successCounter[itr] == conditionKeys.length) return true;
  return false;
}

/**
 * @description checks the appropriate condition satify
 * @param {*} key the matched key
 * @param {*} content the content where the matching occurs
 * @returns true if condition satisfy else false
 */
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

/**
 * Resolves all the operations and displays the output 
 * */
Promise.all(promises).then((val) => {
  result.sort((f, s) => f["size"] - s["size"]);
  if (!result.length) console.log("No Matching Files Found");
  else console.log(frameOutput(result));
  console.log(`returned in ${new Date() - stTime}ms`);
});
