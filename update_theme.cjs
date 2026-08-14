const fs = require('fs');
const path = require('path');

const colorMap = {
  // Hex replacements
  '#9333EA': '#0D2035', // Navy
  '#2DD4FF': '#C8A96B', // Muted Gold
  '#a78bfa': '#DFC993', // Light Gold
  '#38BDF8': '#C8A96B',
  '#06b6d4': '#123452', // Blue Dark
  
  // RGBA purple -> Navy (071525 is 7, 21, 37)
  'rgba(147, 51, 234,': 'rgba(13, 32, 53,',
  'rgba(147,51,234,': 'rgba(13,32,53,',
  'rgba(167, 139, 250,': 'rgba(223, 201, 147,',
  'rgba(167,139,250,': 'rgba(223,201,147,',
  
  // RGBA cyan -> Gold (C8A96B is 200, 169, 107)
  'rgba(45, 212, 255,': 'rgba(200, 169, 107,',
  'rgba(45,212,255,': 'rgba(200,169,107,',
  
  // Glass backgrounds
  "background: 'rgba(255,255,255,0.02)'": "background: 'var(--color-surface-card)'",
  "background: 'rgba(255,255,255,0.04)'": "background: 'var(--color-surface-card)'",
  "background: 'rgba(255,255,255,0.05)'": "background: 'var(--color-surface-raised)'",
  "background: 'rgba(255,255,255,0.03)'": "background: 'var(--color-surface-raised)'",
  
  // Dark borders
  "border: '1px solid rgba(38,38,47,0.9)'": "border: '1px solid var(--color-surface-border)'",
  "border: '1px solid rgba(55,55,68,0.85)'": "border: '1px solid var(--color-surface-border)'",
  
  // Text colors
  "color: 'var(--color-text-primary)'": "color: 'var(--color-text-main)'",
  "color: 'rgba(255,255,255,0.65)'": "color: 'var(--color-text-muted)'",
  "fill: 'rgba(255,255,255,0.5)'": "fill: 'var(--color-text-secondary)'",
  "fill: 'rgba(255,255,255,0.3)'": "fill: 'var(--color-text-muted)'",
  
  // Popups
  "background: 'rgba(19, 19, 25, 0.97)'": "background: 'var(--color-surface-card)'",
  
  // Misc
  "boxShadow: '0 0 10px rgba(45,212,255,0.25)'": "boxShadow: 'none'",
  "boxShadow: '0 0 8px ${color}40'": "boxShadow: 'none'"
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
  
  for (const [oldStr, newStr] of Object.entries(colorMap)) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated theme in:', file);
  }
});
