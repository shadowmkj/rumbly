import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, 'main.asm');
console.log(filePath)
export const readFromFile = () => {
  let mainAsmContent = ""
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    mainAsmContent = data;
  });
  return mainAsmContent
}

