import fs, {
  appendFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import path from "path";

const src = readdirSync("./src");
/**
 *
 * @param {string} dirPath
 * @returns {string[]}
 */
function readAllDirectory(dirPath) {
  let files = [];
  try {
    const items = readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        if (item.name === "ui" || item.name === ".next") {
          continue;
        }
        files = files.concat(readAllDirectory(itemPath));
      } else if (item.isFile()) {
        try {
          readFileSync(itemPath, "utf-8");
          files.push(itemPath);
        } catch (error) {
          console.error(`Error reading file: ${itemPath}`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
  }
  return files;
}

const files = readAllDirectory("./src");
files.forEach((file, index) => {
  const content = readFileSync(file, "utf-8");
  const ext = path.extname(file);
  const fileContent = `## ${index + 1}. Directory: ${file}\n\n\`\`\`${ext.slice(
    1,
    ext.length
  )}\n${content}\`\`\`\n`;
  fs.appendFileSync("prompt.md", fileContent);
});
appendFileSync(
  "prompt.md",
  `# Tasks
- create the README.md file from the given directory and the given code inside the file above
FYI: the README.md file will be created in the root directory, and the author of this repository is Erzy.sh aka Rizqi, and McWooden aka Huddin
who study at SMAN 3 Magelang, kelas XII.`
);
