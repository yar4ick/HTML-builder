const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

function copyDir() {
  const dirPath = path.resolve(__dirname, "files");
  const dirPathCopy = path.resolve(__dirname, `files-copy`);

  fsPromises.mkdir(dirPathCopy, { recursive: true });

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      fsPromises.copyFile(
        path.join(dirPath, file.name),
        path.join(dirPathCopy, file.name)
      );
    });
  });
}

copyDir();
