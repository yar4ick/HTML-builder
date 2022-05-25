const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

function buildPage() {
  const dstDirPath = path.resolve(__dirname, "project-dist");
  createDir(dstDirPath);

  const dirBundlePath = path.resolve(__dirname, "project-dist/style.css");
  const dirStylesPath = path.resolve(__dirname, "styles");

  mergeStyles(dirStylesPath, dirBundlePath);

  const dirPath = path.resolve(__dirname, "assets");
  const dirPathCopy = path.resolve(__dirname, `project-dist/assets`);

  copyDir(dirPath, dirPathCopy);

  const htmlPath = path.resolve(__dirname, "project-dist/index.html");
  const templatePath = path.resolve(__dirname, "template.html");
  const componentsPath = path.resolve(__dirname, "components");
  replaceHtmlTags(templatePath, htmlPath, componentsPath);
}

function createDir(path) {
  fsPromises.mkdir(path, { recursive: true });
}

function mergeStyles(dirStylesPath, dirBundlePath) {
  const streamToWrite = fs.createWriteStream(dirBundlePath);
  const FIRST_CSS_FILE = "header.css";

  fs.readdir(dirStylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    for (let file of files) {
      filePath = path.join(dirStylesPath, file.name);
      if (file.name === FIRST_CSS_FILE) {
        const streamToRead = fs.createReadStream(filePath, "utf-8");
        streamToRead.on("data", (chunk) => {
          streamToWrite.write(chunk);
        });
      }
    }

    files.forEach((file) => {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
      filePath = path.join(dirStylesPath, file.name);
      if (fileExtension === "css" && file.name != FIRST_CSS_FILE) {
        const streamToRead = fs.createReadStream(filePath, "utf-8");
        streamToRead.on("data", (chunk) => {
          streamToWrite.write(chunk);
        });
      }
    });
  });
}

async function copyDir(dirPath, dirPathCopy) {
  await fs.promises.rm(dirPathCopy, { recursive: true, force: true });
  fs.mkdir(dirPathCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      if (file.isFile()) {
        fsPromises.copyFile(
          path.join(dirPath, file.name),
          path.join(dirPathCopy, file.name)
        );
      } else if (file.isDirectory()) {
        copyDir(
          path.join(dirPath, file.name),
          path.join(dirPathCopy, file.name)
        );
      }
    });
  });
}

async function replaceHtmlTags(templatePath, htmlPath, componentsPath) {
  const componenetsArr = await fsPromises.readdir(componentsPath, {
    withFileTypes: true,
  });
  let htmlData = await fsPromises.readFile(templatePath, "utf-8");

  for (let component of componenetsArr) {
    const componentContent = await fsPromises.readFile(
      path.join(componentsPath, component.name),
      "utf-8"
    );
    htmlData = htmlData.replace(
      `{{${component.name.slice(0, component.name.indexOf(".", 0))}}}`,
      componentContent
    );
    await fsPromises.writeFile(htmlPath, htmlData);
  }
}

buildPage();
