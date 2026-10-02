// Keep browser credits and committed detail pages aligned with the photo registry.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const records = JSON.parse(fs.readFileSync(path.join(root, 'assets/course-photos/credits.json'), 'utf8'));
const ids = new Set();
for (const p of records) {
  if (!p.src.startsWith('/assets/course-photos/') || !fs.existsSync(path.join(root, p.src))) throw new Error(`Missing asset: ${p.src}`);
  for (const [id, name] of Object.entries(p.courses)) {
    if (ids.has(id)) throw new Error(`Duplicate course: ${id}`);
    ids.add(id);
    const page = fs.readFileSync(path.join(root, 'courses', id, 'index.html'), 'utf8');
    if (page.match(/<h1>(.*?)<\/h1>/)?.[1] !== name) throw new Error(`Course name changed: ${id}`);
  }
}
const modulePath = path.join(root, 'course-photos.js');
let moduleText = fs.readFileSync(modulePath, 'utf8');
moduleText = moduleText.replace(/  const records = [\s\S]*?;\n  const escape/, () => `  const records = ${JSON.stringify(records, null, 2)};\n  const escape`);
fs.writeFileSync(modulePath, moduleText);
const photos = require(modulePath);
for (const id of ids) {
  const file = path.join(root, 'courses', id, 'index.html');
  let page = fs.readFileSync(file, 'utf8');
  page = page.replace(/<figure class="curated-course-photo"[\s\S]*?<\/figure>/g, '');
  const name = page.match(/<h1>(.*?)<\/h1>/)[1];
  page = page.replace(/<h1>(.*?)<\/h1>/, match => match + photos.figure({ id, name }));
  fs.writeFileSync(file, page);
}
console.log(`Synced ${records.length} photos across ${ids.size} course pages.`);
