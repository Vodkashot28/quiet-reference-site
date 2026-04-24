const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const dir = '_site/assets/social';
if (!fs.existsSync(dir)) {
  console.log('No social card directory found, skipping.');
  process.exit(0);
}
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.svg')) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.svg', '.png'));
    const svg = fs.readFileSync(input, 'utf8'); // important: read as string
    const resvg = new Resvg(svg);
    const pngData = resvg.render().asPng();
    fs.writeFileSync(output, pngData);
    console.log(`✔ Converted ${file}`);
  }
});
