
for()
/*
const fs = require("fs");

/* inputs */

const fieldVal = "git+https://github.com/kugesh-Rajasekaran/query-json.git";
const conditions = {
  name: { value: "query-json", condition: 'equal' },
  start: { value: "node test-1", condition: 'equal' },
};

/*        */

const result = {};
const fileNames = fs.readdirSync("./json-files");
const noOfFiles = fileNames.length;
let itr;
for (itr = 0; itr < noOfFiles; itr++) {
  const fileName = fileNames[itr];
  fs.readFile(`./json-files/${fileName}`, "utf-8", (err, jsonStr) => {
    const jsonObj = JSON.parse(jsonStr);
    const targetValFound = isValExist(Object.values(jsonObj));
    if (targetValFound)
      result[fileName] = fs.statSync(`./json-files/${fileNames[0]}`).size;

    // const condSatisfied = isCondSatisfied(Object.keys(jsonObj));
    // if(condSatisfied)
    //     result[fileName] = fs.statSync(`./json-files/${fileName}`).size;
    console.log(result);
  });
}

// function isCondSatisfied(lok) {
//     if(!lok)
//         return false;
//     for()
// }

/* lov - list of values */
function isValExist(lov)  {
  if (!lov) return false;
  if (lov.includes(fieldVal)) return true;
  let itr,
    objLen = lov.length;
  for (itr = 0; itr < objLen; itr++) {
    console.log(itr);
    const objProp = lov[itr],
      propType = typeof lov[itr];
    if (propType == "object") {
      const existOrNot = isValExist(Object.values(objProp));
      if (existOrNot) return true;
    }
  }
  return false;
}
