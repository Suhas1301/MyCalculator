const fs = require('fs');
let content = fs.readFileSync('src/modules/basic/BasicCalculator.jsx', 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
content = content.replace(/\\\\d/g, '\\d');
content = content.replace(/\\\\-/g, '\\-');

fs.writeFileSync('src/modules/basic/BasicCalculator.jsx', content);
