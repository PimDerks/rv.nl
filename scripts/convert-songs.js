const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "../src/jekyll/_songs");
const targetDir = path.join(__dirname, "../content/_songs");

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md"));

let converted = 0;

for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);

  let content = fs.readFileSync(sourcePath, "utf-8");

  // Split front matter and body
  const parts = content.split("---");
  if (parts.length < 3) {
    // No body or malformed
    fs.writeFileSync(targetPath, content);
    converted++;
    continue;
  }

  const frontMatter = parts[1];
  let body = parts.slice(2).join("---").trim();

  if (!body) {
    // No body content
    fs.writeFileSync(targetPath, content);
    converted++;
    continue;
  }

  // Convert HTML to Markdown
  // 1. <p class="em">Label:</p> -> **Label:**
  body = body.replace(/<p class="em">([^<]+)<\/p>/g, "**$1**");

  // 2. <p>...</p> -> content with blank lines
  body = body.replace(/<p>/g, "");
  body = body.replace(/<\/p>/g, "\n");

  // 3. <br /> or <br> -> two spaces + newline (for Markdown line breaks)
  body = body.replace(/<br\s*\/?>/g, "  \n");

  // 4. Clean up multiple newlines
  body = body.replace(/\n{3,}/g, "\n\n");

  // 5. Trim
  body = body.trim();

  const output = `---${frontMatter}---\n\n${body}\n`;
  fs.writeFileSync(targetPath, output);
  converted++;
}

console.log(`Converted ${converted} song files`);
