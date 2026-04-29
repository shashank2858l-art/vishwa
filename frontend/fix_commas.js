const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n/translations.ts', 'utf8');
c = c.replace(/"nav\.selectLang": "([^"]+)"\s+"home\.hero\.speak"/g, '"nav.selectLang": "$1",\n    "home.hero.speak"');
fs.writeFileSync('src/lib/i18n/translations.ts', c);
console.log('Fixed missing commas');
