const fs = require('fs').promises;
const path = require('path');

const projectDistDir = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const replaceTemplateTags = async (templateContent, componentsDir) => {
  const tagRegex = /\{\{([^}]+)\}\}/g;

  const matches = [...templateContent.matchAll(tagRegex)];

  for (const match of matches) {
    const tagName = match[1];
    const componentPath = path.join(componentsDir, `${tagName}.html`);

    try {
      const componentContent = await readFile(componentPath);
      templateContent = templateContent.replace(match[0], componentContent);
    } catch (error) {
      throw new Error(`Error replacing template tags: ${error.message}`);
    }
  }

  return templateContent;
};

const compileStyles = async (stylesDir) => {
  const styleFiles = (await fs.readdir(stylesDir)).filter(
    (file) => path.extname(file) === '.css',
  );
  const styleContents = await Promise.all(
    styleFiles.map((file) => readFile(path.join(stylesDir, file))),
  );
  return styleContents.join('\n');
};

const copyAssets = async (srcDir, destDir) => {
  try {
    const destAssetsDir = path.join(destDir, 'assets');
    await fs.mkdir(destAssetsDir, { recursive: true });

    const files = await fs.readdir(srcDir);

    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destAssetsDir, file);

      const stats = await fs.stat(srcPath);

      if (stats.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (stats.isDirectory()) {
        const subDestDir = path.join(destAssetsDir, file);
        await fs.mkdir(subDestDir, { recursive: true });
        await copyAssets(srcPath, subDestDir);
      }
    }
  } catch (error) {
    throw new Error(`Error copying assets: ${error.message}`);
  }
};

const buildProject = async () => {
  try {
    await fs.mkdir(projectDistDir, { recursive: true });

    const templateContent = await readFile(templatePath);
    const updatedTemplate = await replaceTemplateTags(
      templateContent,
      componentsDir,
    );
    await fs.writeFile(
      path.join(projectDistDir, 'index.html'),
      updatedTemplate,
    );

    const compiledStyles = await compileStyles(stylesDir);
    await fs.writeFile(path.join(projectDistDir, 'style.css'), compiledStyles);

    await copyAssets(assetsDir, projectDistDir);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error(`Error building project: ${error.message}`);
  }
};

buildProject();
