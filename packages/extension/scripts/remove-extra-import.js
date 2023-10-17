import fs from "node:fs";

const assets_files = fs.readdirSync("./dist/assets");
const content_script_file = assets_files.find((file) => file.startsWith("index.html"));

const content_script = fs.readFileSync(`./dist/assets/${content_script_file}`, "utf-8");

// find the start and end of `import (VAR) from"difflib"` and replace it with `var (VAR)=difflib`
const import_regex = /import (.*) from"difflib"/g;
const import_match = import_regex.exec(content_script);
if (!import_match) {
  throw new Error("Could not find difflib import match");
}

const variable_name = import_match[1];
const replacement = `var ${variable_name}=difflib`;

const new_content_script = content_script.replace(import_regex, replacement);
fs.writeFileSync(`./dist/assets/${content_script_file}`, new_content_script, "utf8");
