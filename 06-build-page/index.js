const {
    stdin,
    stdout,
    exit
} = process;
const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname);
const pathComponents = path.join(__dirname, 'components');
const pathFolderAssets = path.join(__dirname, 'assets');
const pathFolderStyles = path.join(__dirname, 'styles');
const pathFolderHtml = path.join(__dirname, 'template.html');

const pathFolderTarget = path.join(__dirname, 'project-dist');
const pathFolderTargetHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathFolderTargetAssets = path.join(__dirname, 'project-dist', 'assets');
const pathFolderTargetStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

// build page
async function buildPage() {
    try {
        // await fs.promises.rm(pathFolderTarget, { recursive: true, force: true });
        await fs.promises.mkdir(pathFolderTarget, {
            recursive: true
        });
        createHtml(pathFolderHtml, pathFolderTargetHtml, pathComponents);
        copyDirectory(pathFolderAssets, pathFolderTargetAssets);
        mergeStyles();
    } catch (err) {
        stdout.write('err');
    }
}
buildPage();

//copy assets
async function copyDirectory(pathFolderAssets, pathFolderTargetAssets) {
    try {
        await fs.promises.rm(pathFolderTargetAssets, {
            recursive: true,
            force: true
        });
        await fs.promises.mkdir(pathFolderTargetAssets, {
            recursive: true
        });

        const folders = await fs.promises.readdir(pathFolderAssets, {
            withFileTypes: true
        });
        for (let folder of folders) {
            const original = path.join(pathFolderAssets, folder.name);
            const copy = path.join(pathFolderTargetAssets, folder.name);
            if (folder.isFile()) {
                await fs.promises.copyFile(original, copy);
            } else {
                await copyDirectory(original, copy);
            }
        }
    } catch (err) {
        stdout.write('err');
    }
}


// merge styles
async function mergeStyles() {
    try {
        fs.readdir(pathFolderStyles, {
            withFileTypes: true
        }, (err, files) => {
            if (err) stdout.write('err');
            files.forEach(file => {
                if (file.isFile()) {
                    const pathFile = path.join(pathFolderStyles, file.name);
                    fs.stat(pathFile, (err, stats) => {
                        if (err) stdout.write('err');
                        const ext = `${path.parse(file.name).ext.slice(1)}`;
                        if (ext == 'css') {
                            const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                            readableStream.on('data', data => pathFolderTargetStyles.write(data));
                        }
                    });
                };
            });
        });
    } catch (err) {
        stdout.write('err');
    }
}

async function createHtml(pathFolderHtml, pathFolderTargetHtml, pathComponents) {
    try {
        let textHtml = await fs.promises.readFile(pathFolderHtml, 'utf-8');
        const components = await fs.promises.readdir(pathComponents);
        for (const component of components) {
            const pathComponent = path.join(pathComponents, component);
            const extComponent = path.parse(component).ext;
            const nameComponent = path.basename(pathComponent, extComponent);
            let dataComponent = await fs.promises.readFile(pathComponent, 'utf-8');
            textHtml = textHtml.replace(`{{${nameComponent}}}`, dataComponent);
        }
        await fs.promises.writeFile(pathFolderTargetHtml, textHtml);

    } catch (err) {
        stdout.write('err');
    }
}