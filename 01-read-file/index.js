const path = require("path");
const fs = require("fs");

function readFile() {
  const filePath = path.resolve(__dirname, "./text.txt");
  const streamToRead = fs.createReadStream(filePath, "utf-8");

  streamToRead.on("data", (chunk) => {
    console.log(chunk);
  });
}

readFile();
