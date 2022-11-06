const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');
const pathFolder = fs.createWriteStream(path.join(__dirname, 'text.txt'));


async function writeFile() {
    try {        
        stdout.write('Please enter your favorite colors\n');
        stdin.on('data', data => {
            try {
                if (data.toString().trim().length === 0) {
                    process.exit();
                } else if (data.toString().trim() === 'exit') {
                    process.exit();
                }else {
                    pathFolder.write(data);
                }
            } catch (err) {
                stdout.write('Enter a color, the string cannot be empty!\n');
            }
        })
        process.on('exit', () => stdout.write('Bye Bye'));
        process.on('SIGINT', () => process.exit());
    } catch (err) {
        stdout.write('err');
    }
}
writeFile();