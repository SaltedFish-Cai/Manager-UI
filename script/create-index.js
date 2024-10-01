import fs from "fs";
import { join } from "path";

// 源文件路径
const sourcePath = `./document/index/${process.argv[3]}.md`;

// 目标文件夹路径
const targetDir = "./";

// 目标文件路径
const targetPath = join(targetDir, `./index.md`);
// 确保目标目录存在
fs.mkdir(targetDir, { recursive: true }, err => {
  if (err) throw err;

  // 复制文件
  fs.copyFile(sourcePath, targetPath, err => {
    if (err) throw err;
    console.log("文件复制成功");
  });
});
