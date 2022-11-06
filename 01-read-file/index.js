const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'text.txt');


async function readFile() {
    try {
        const readableStream = fs.createReadStream(pathFolder, 'utf-8');
        readableStream.on('data', chunk => stdout.write(chunk));
    } catch (err) {
        stdout.write('err');
    }
}
readFile();