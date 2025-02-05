const fs = require('fs');
const path = require('path');

function generateJsonStructure(dirPath) {
    const items = [];

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        entries.forEach((entry) => {
            if (entry.isDirectory()) {
                const subDirPath = path.join(dirPath, entry.name);
                const subDirStructure = {
                    text: entry.name,
                    collapsed: true
                };
                const subItems = generateJsonStructure(subDirPath);
                if (subItems.length > 0) {
                    subDirStructure.items = subItems;
                }
                items.push(subDirStructure);
            } else if (entry.isFile() && path.extname(entry.name) === '.md') {
                const filePath = path.join(dirPath, entry.name);
                const fileName = path.basename(entry.name, '.md');
                const fileLink = path.relative('.', filePath).replace(/\.md$/, '');
                items.push({ text: fileName, link: `/${fileLink}` });
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }

    return items;
}

// 定义 src 目录的路径
const srcPath = 'src';
// 生成 JSON 结构
const jsonStructure = generateJsonStructure(srcPath);
// 将 JSON 结构转换为字符串，缩进为 2 个空格
const jsonOutput = JSON.stringify(jsonStructure, null, 2);

// 将 JSON 结构写入 menu.json 文件
fs.writeFile('menu.json', jsonOutput, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to menu.json:', err);
    } else {
        console.log('Successfully written to menu.json');
    }
});