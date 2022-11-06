const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'secret-folder');


async function getFilesFolder() {
    try {
        fs.readdir(pathFolder, {
            withFileTypes: true
        }, (err, files) => {
            if (err) stdout.write('err');
            files.forEach(file => {
                if (file.isFile()) {
                    const pathFile = path.join(pathFolder, file.name);
                    fs.stat(pathFile, (err, stats) => {
                        if (err) stdout.write('err');
                        stdout.write(`${path.parse(file.name).name} - ${path.parse(file.name).ext.slice(1)} - ${stats.size} bytes\n`);
                    });
                };
            });
        });
    } catch (err) {
        stdout.write('err');
    }
}
getFilesFolder();
