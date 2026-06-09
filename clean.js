const fs = require('fs');
let content = fs.readFileSync('src/components/shop/order-form.tsx', 'utf8');

// Remove references to totebag and laptopsleeve logic from the component
const lines = content.split('\n');
const newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('if (formData.totebagSelected) {')) {
    skip = true;
  }
  if (line.includes('if (formData.laptopsleeveSelected) {')) {
    skip = true;
  }
  
  if (skip) {
    if (line.trim() === '}') {
        // We might be at the end of the block. Let's just use string replace.
    }
  }
}

content = content.replace(/totebagSelected: boolean;\n\s*totebagQuantity: number;\n\s*laptopsleeveSelected: boolean;\n\s*laptopsleeveQuantity: number;/, '');
content = content.replace(/totebagSelected:\s*(true|false),\n\s*totebagQuantity:\s*\d+,\n\s*laptopsleeveSelected:\s*(true|false),\n\s*laptopsleeveQuantity:\s*\d+,/, '');

// Validation logic
content = content.replace(/if \(formData\.totebagSelected\) \{[\s\S]*?(?=\s*if \(formData\.laptopsleeveSelected\))/g, '');
content = content.replace(/if \(formData\.laptopsleeveSelected\) \{[\s\S]*?(?=\s*if \(!formData\.student\))/g, '');

// Order compilation
content = content.replace(/if \(formData\.totebagSelected\) \{[\s\S]*?(?=\s*if \(formData\.laptopsleeveSelected\))/g, '');
content = content.replace(/if \(formData\.laptopsleeveSelected\) \{[\s\S]*?(?=\s*\}\s*catch)/g, ''); // Wait, let's just do it manually.

fs.writeFileSync('src/components/shop/order-form.tsx.tmp', content);
