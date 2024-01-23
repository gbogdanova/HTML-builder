const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'file-copy');

async function copyDirectory() {
  const dirCreation = await fs.mkdir(folderCopyPath, { recursive: true });

  const files = await fs.readdir(folderPath);
  const filesCopy = await fs.readdir(folderCopyPath);

  for (const fileCopy of filesCopy) {
    const fileCopyPath = path.join(folderCopyPath, fileCopy);
    if (!files.includes(fileCopy)) {
      await fs.unlink(fileCopyPath);
    }
  }

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileCopyPath = path.join(folderCopyPath, file);
    await fs.copyFile(filePath, fileCopyPath);
  }
  console.log('Files copied sucsessfully!');
  return dirCreation;
}

copyDirectory().catch(console.error);
