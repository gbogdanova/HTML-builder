const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'file-copy');

async function copyDirectory() {
  const dirCreation = await fs.mkdir(folderCopyPath, { recursive: true });

  const files = await fs.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileCopyPath = path.join(folderCopyPath, file);
    await fs.copyFile(filePath, fileCopyPath);
  }
  console.log('Files copied sucsessfully!');
  return dirCreation;
}

copyDirectory().catch(console.error);
