const path = require("path");
const fs = require("fs");

function readFiles() {
  const dirPath = path.resolve(__dirname, `secret-folder`);

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(path.join(dirPath, file.name), (err, stats) => {
          if (err) {
            return console.log("Unable to get file size: " + err);
          }

          fileName = file.name.slice(0, file.name.indexOf(".", 0));
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          console.log(
            fileName +
              " - " +
              fileExtension +
              " - " +
              Math.ceil(stats.size / 1024) +
              " KB"
          );
        });
      }
    });
  });
}

readFiles();
