const fs = require("fs");

let itr;
for(itr = 1 ; itr < 20000 ; itr++ ){
    const contentToWrite = `{
        "name": "query-json",
        "version": "1.0.0",
        "description": "",
        "main": "main.js",
        "scripts": {
          "start": "node test-1"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/kugesh-Rajasekaran/query-json.git"
        },
        "author": "",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/kugesh-Rajasekaran/query-json/issues"
        },
        "homepage": "https://github.com/kugesh-Rajasekaran/query-json#readme"
      }
      `;
    fs.writeFile(`./json-files-large/file-${itr}.json`, contentToWrite, (err) => {
          console.log(`file saved!!`)
      } );
}