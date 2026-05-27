const fs = require("node:fs");
const path = require("node:path");

const source = path.join(__dirname, "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm");
const targetDir = path.join(__dirname, "..", "public");
const target = path.join(targetDir, "sql-wasm.wasm");

if (fs.existsSync(source)) {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(source, target);
}
