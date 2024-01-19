const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function listFiles() {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.slice(1);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listFiles();
