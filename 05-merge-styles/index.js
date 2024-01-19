const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundleFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(bundleFolderPath, 'bundle.css');

async function cssBundle() {
  try {
    const files = await fs.promises.readdir(stylesPath);
    const filesCSS = files.filter((file) => path.extname(file) === '.css');
    console.log(filesCSS);
    const streamWrite = fs.createWriteStream(bundleFilePath, {
      flags: 'w',
      encoding: 'utf-8',
    });

    for (const file of filesCSS) {
      const filePath = path.join(stylesPath, file);
      const fileRead = await fs.promises.readFile(filePath, 'utf-8');
      streamWrite.write(fileRead);
    }

    streamWrite.end();

    streamWrite.on('finish', () => {
      console.log('Bundle created successfully!');
    });
  } catch (err) {
    console.error(err);
  }
}

cssBundle();
