#!/usr/bin/env node

/**
 * Dark Mode Class Mapper
 * This script helps identify common patterns that need dark mode classes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common class mappings for dark mode
const classMappings = {
  // Backgrounds
  'bg-white': 'bg-white dark:bg-gray-800',
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-700',
  'bg-gray-200': 'bg-gray-200 dark:bg-gray-600',
  
  // Text colors
  'text-gray-900': 'text-gray-900 dark:text-white',
  'text-gray-800': 'text-gray-800 dark:text-gray-100',
  'text-gray-700': 'text-gray-700 dark:text-gray-200',
  'text-gray-600': 'text-gray-600 dark:text-gray-300',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'text-gray-400': 'text-gray-400 dark:text-gray-500',
  
  // Borders
  'border-gray-200': 'border-gray-200 dark:border-gray-700',
  'border-gray-300': 'border-gray-300 dark:border-gray-600',
  'border-gray-400': 'border-gray-400 dark:border-gray-500',
  
  // Hover states
  'hover:bg-gray-100': 'hover:bg-gray-100 dark:hover:bg-gray-700',
  'hover:bg-gray-200': 'hover:bg-gray-200 dark:hover:bg-gray-600',
  'hover:text-gray-600': 'hover:text-gray-600 dark:hover:text-gray-300',
  'hover:text-gray-700': 'hover:text-gray-700 dark:hover:text-gray-200',
  
  // Focus states
  'focus:ring-primary-500': 'focus:ring-primary-500 dark:focus:ring-primary-400',
  'focus:ring-offset-2': 'focus:ring-offset-2 dark:focus:ring-offset-gray-800',
  
  // Placeholders
  'placeholder-gray-500': 'placeholder-gray-500 dark:placeholder-gray-400',
  'placeholder-gray-400': 'placeholder-gray-400 dark:placeholder-gray-500',
};

function findFiles(dir, extension = '.tsx') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, extension));
    } else if (stat.isFile() && item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const suggestions = [];
  
  for (const [lightClass, darkClass] of Object.entries(classMappings)) {
    if (content.includes(lightClass) && !content.includes(darkClass)) {
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes(lightClass) && !line.includes('dark:')) {
          suggestions.push({
            file: filePath,
            line: index + 1,
            original: lightClass,
            suggested: darkClass,
            context: line.trim()
          });
        }
      });
    }
  }
  
  return suggestions;
}

function main() {
  const srcDir = path.join(__dirname, 'src', 'components');
  
  if (!fs.existsSync(srcDir)) {
    console.log('❌ Components directory not found');
    return;
  }
  
  console.log('🔍 Analyzing components for dark mode opportunities...\n');
  
  const files = findFiles(srcDir);
  const allSuggestions = [];
  
  files.forEach(file => {
    const suggestions = analyzeFile(file);
    allSuggestions.push(...suggestions);
  });
  
  if (allSuggestions.length === 0) {
    console.log('✅ All components already have dark mode classes!');
    return;
  }
  
  console.log(`📊 Found ${allSuggestions.length} opportunities for dark mode improvements:\n`);
  
  // Group by file
  const byFile = allSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.file]) {
      acc[suggestion.file] = [];
    }
    acc[suggestion.file].push(suggestion);
    return acc;
  }, {});
  
  Object.entries(byFile).forEach(([file, suggestions]) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`📁 ${relativePath}`);
    
    suggestions.forEach(suggestion => {
      console.log(`   Line ${suggestion.line}: ${suggestion.original} → ${suggestion.suggested}`);
      console.log(`   Context: ${suggestion.context}`);
      console.log('');
    });
  });
  
  console.log('💡 To apply these changes:');
  console.log('1. Open each file mentioned above');
  console.log('2. Replace the light-only classes with the suggested dark mode classes');
  console.log('3. Test both light and dark themes');
  console.log('4. Run this script again to verify all changes are applied');
}

// Run the script
main();

export { classMappings, analyzeFile };
