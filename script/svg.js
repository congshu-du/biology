import fs from "fs";
import path from "path";

fs.readdir("./src/assets/svgs", (err, files) => {
  if (err) {
    return console.error("Unable to scan directory: " + err);
  }

  const svgFiles = files.filter((file) => path.extname(file) === ".svg").map((n) => n.slice(0, -4));

  const content = `export const svgNames = [\n  ${svgFiles.map((file) => `"${file}"`).join(",\n  ")}\n] as const;\n`;
  fs.writeFile("./src/assets/svgs/index.ts", content, (err) => {
    if (err) {
      return console.error("Error writing file: " + err);
    }

    console.log("svg 文件名已经被写入到 index.ts 中");
  });
});
