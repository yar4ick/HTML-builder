const path = require("path");
const fs = require("fs");

function mergeStyles() {
  const dirBundlePath = path.resolve(__dirname, "project-dist/bundle.css");
  const dirStylesPath = path.resolve(__dirname, "styles");
  const streamToWrite = fs.createWriteStream(dirBundlePath);

  fs.readdir(dirStylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
      filePath = path.join(dirStylesPath, file.name);
      if (fileExtension === "css") {
        const streamToRead = fs.createReadStream(filePath, "utf-8");
        streamToRead.on("data", (chunk) => {
          streamToWrite.write(chunk);
        });
      }
    });
  });
}

mergeStyles();
