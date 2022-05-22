const path = require("path");
const fs = require("fs");
const readline = require("readline");

function writeToFile() {
  const filePath = path.resolve(__dirname, `./input_${Date.now()}.txt`);
  const streamToWrite = fs.createWriteStream(filePath);

  const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter a sentence (enter exit or Ctrl+c to break the process): ",
  });

  readLine.prompt();

  readLine
    .on("line", (line) => {
      if (line.trim() != "exit") {
        streamToWrite.write(line + "\n");
        readLine.prompt();
      } else {
        readLine.close();
      }
    })
    .on("close", () => {
      streamToWrite.end();
      streamToWrite.on("finish", () => {
        console.log(`\nYour sentences have been saved to: ${filePath}`);
      });
    });
}

writeToFile();
