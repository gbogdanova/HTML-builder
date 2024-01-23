const fs = require('fs');
const path = require('path');
const readline = require('readline');

const outputFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(outputFile);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Try to type something.');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Bye! Have a nice day!');
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('Bye! Have a nice day!');
  rl.close();
});
