const fs = require('fs');
const path = require('path');

const replacements = {
  'ðŸ›¡ï¸ ': '🛡️',
  'ðŸ“Š': '📊',
  'ðŸ’¬': '💬',
  'ðŸ“œ': '📜',
  'â€“': '–' // en dash
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [mojibake, correct] of Object.entries(replacements)) {
    if (content.includes(mojibake)) {
      content = content.split(mojibake).join(correct);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
