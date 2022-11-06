const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'styles');
const pathFolderTarget = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));


async function mergeStyles() {
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
                        const ext = `${path.parse(file.name).ext.slice(1)}`;
                        if (ext == 'css') {
                            const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                            readableStream.on('data', data => pathFolderTarget.write(data));
                        }
                    });
                };
            });
        });
    } catch (err) {
        stdout.write('err');
    }
}
mergeStyles();
