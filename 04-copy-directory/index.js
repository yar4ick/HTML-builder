const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

async function copyDir() {
  const dirPath = path.resolve(__dirname, "files");
  const dirPathCopy = path.resolve(__dirname, `files-copy`);

  await fs.promises.rm(dirPathCopy, { recursive: true, force: true });
  fs.mkdir(dirPathCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });

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
