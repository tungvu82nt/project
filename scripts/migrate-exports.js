#!/usr/bin/env node

/**
 * Migration script to convert named exports to default exports
 * and update corresponding imports across the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const COMPONENTS_TO_MIGRATE = [
  'UserMenu',
  'LanguageSelector',
  'LoginModal',
  'ProductCard',
  'NewsletterSection',
  'TestimonialsSection',
  'ProductViewer3D'
];

/**
 * Find all TypeScript/React files in the src directory
 */
function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Convert named export to default export in a file
 */
function convertToDefaultExport(filePath, componentName) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern for named export
  const namedExportPattern = new RegExp(`export const ${componentName}[^=]*=`, 'g');
  const namedExportAtEnd = new RegExp(`export\s*{\s*${componentName}\s*}`, 'g');
  
  if (namedExportPattern.test(content)) {
    // Convert "export const ComponentName = ..." to "const ComponentName = ..."
    content = content.replace(namedExportPattern, `const ${componentName} =`);
    
    // Add default export at the end if not already present
    if (!content.includes(`export default ${componentName}`)) {
      content += `\n\nexport default ${componentName};`;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Converted ${componentName} to default export in ${filePath}`);
    return true;
  }
  
  if (namedExportAtEnd.test(content)) {
    // Convert "export { ComponentName }" to "export default ComponentName"
    content = content.replace(namedExportAtEnd, `export default ${componentName}`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Converted ${componentName} to default export in ${filePath}`);
    return true;
  }
  
  return false;
}

/**
 * Update imports in a file
 */
function updateImports(filePath, componentName) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern for named import
  const namedImportPattern = new RegExp(
    `import\s*{([^}]*\s*${componentName}\s*[^}]*)}\s*from\s*(['"][^'"]*['"])`,
    'g'
  );
  
  content = content.replace(namedImportPattern, (match, imports, fromPath) => {
    const importList = imports.split(',').map(imp => imp.trim()).filter(imp => imp);
    const otherImports = importList.filter(imp => !imp.includes(componentName));
    
    let result = '';
    
    // Add default import for the component
    result += `import ${componentName} from ${fromPath};\n`;
    
    // Add remaining named imports if any
    if (otherImports.length > 0) {
      result += `import { ${otherImports.join(', ')} } from ${fromPath};`;
    }
    
    modified = true;
    return result;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated imports for ${componentName} in ${filePath}`);
  }
  
  return modified;
}

/**
 * Main migration function
 */
function migrate() {
  console.log('🚀 Starting export/import migration...');
  
  const allFiles = findTsxFiles(SRC_DIR);
  console.log(`📁 Found ${allFiles.length} TypeScript/React files`);
  
  for (const componentName of COMPONENTS_TO_MIGRATE) {
    console.log(`\n🔄 Migrating ${componentName}...`);
    
    let componentConverted = false;
    
    // Step 1: Convert the component's export
    for (const filePath of allFiles) {
      const fileName = path.basename(filePath, path.extname(filePath));
      if (fileName === componentName) {
        if (convertToDefaultExport(filePath, componentName)) {
          componentConverted = true;
        }
        break;
      }
    }
    
    // Step 2: Update all imports of this component
    if (componentConverted) {
      for (const filePath of allFiles) {
        updateImports(filePath, componentName);
      }
    } else {
      console.log(`⚠️  Component ${componentName} not found or already using default export`);
    }
  }
  
  console.log('\n✨ Migration completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run `npm run type-check` to verify TypeScript compilation');
  console.log('2. Run `npm run lint:fix` to fix any linting issues');
  console.log('3. Test the application to ensure everything works correctly');
}

// Run migration
if (require.main === module) {
  migrate();
}

module.exports = { migrate };