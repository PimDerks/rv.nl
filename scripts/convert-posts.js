const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "../src/jekyll/_posts");
const targetDir = path.join(__dirname, "../content/_posts");

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md"));

let converted = 0;

for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  // Change extension to .mdx
  const mdxFile = file.replace(/\.md$/, ".mdx");
  const targetPath = path.join(targetDir, mdxFile);

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

  // Convert HTML to Markdown/MDX

  // 1. YouTube iframes -> <YouTubeEmbed> component
  // Match iframe with youtube embed
  body = body.replace(
    /<div class="u-ratio[^"]*">\s*<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"[^>]*><\/iframe>\s*<\/div>/g,
    '<YouTubeEmbed videoId="$1" />'
  );
  body = body.replace(
    /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"[^>]*><\/iframe>/g,
    '<YouTubeEmbed videoId="$1" />'
  );

  // 2. <a class="button">...</a> -> plain markdown link
  body = body.replace(
    /<a href="([^"]+)" class="button">([^<]+)<\/a>/g,
    "[$2]($1)"
  );

  // 3. <p style="font-style:italic;">...</p> -> *...*
  body = body.replace(
    /<p style="font-style:italic;">([^<]+)<\/p>/g,
    "*$1*"
  );

  // 4. <img src="..." /> -> ![](...)
  body = body.replace(/<img src="([^"]+)"[^>]*\/?>/g, "![]($1)");

  // 5. <h2 class="...">...</h2> -> ## ...
  body = body.replace(/<h2[^>]*>([^<]+)<\/h2>/g, "## $1");

  // 6. <ol>/<li> -> numbered list
  body = body.replace(/<ol>/g, "");
  body = body.replace(/<\/ol>/g, "");
  let listIndex = 0;
  body = body.replace(/<li>([^<]+)<\/li>/g, (match, content) => {
    listIndex++;
    return `${listIndex}. ${content.trim()}`;
  });

  // 7. <ul>/<li> (if any)
  body = body.replace(/<ul>/g, "");
  body = body.replace(/<\/ul>/g, "");
  body = body.replace(/<li>/g, "- ");
  body = body.replace(/<\/li>/g, "");

  // 8. <p>...</p> -> just content with blank lines
  body = body.replace(/<p>/g, "");
  body = body.replace(/<\/p>/g, "\n");

  // 9. <br> or <br /> -> newline
  body = body.replace(/<br\s*\/?>/g, "\n");

  // 10. <a href="...">...</a> -> [text](url)
  body = body.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, "[$2]($1)");

  // 11. Fix unclosed </p> (just remove stray ones)
  body = body.replace(/<\/p>/g, "");

  // 12. Clean up multiple newlines
  body = body.replace(/\n{3,}/g, "\n\n");

  // 13. Clean up tabs
  body = body.replace(/\t/g, "");

  // 14. Trim
  body = body.trim();

  const output = `---${frontMatter}---\n\n${body}\n`;
  fs.writeFileSync(targetPath, output);
  converted++;
}

console.log(`Converted ${converted} post files to MDX`);
