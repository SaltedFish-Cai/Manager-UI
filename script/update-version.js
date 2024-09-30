import fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filenameNew = fileURLToPath(import.meta.url);
const __dirnameNew = dirname(__filenameNew);
function updateVersion() {
  fs.readFile(resolve(__dirnameNew, "../version.json"), "utf8", (err, data) => {
    if (err) throw err;
    const _Json = JSON.parse(data);
    const version = _Json.version;
    const versionArr = version.split(".");
    versionArr[2]++;
    const newVersion = versionArr.join(".");
    _Json.version = newVersion;
    const JsonString = JSON.stringify(_Json);
    fs.writeFile(resolve(__dirnameNew, "../version.json"), JsonString, err => {
      if (err) throw err;
      console.log("File has been saved!");
    });
  });
}
updateVersion();
