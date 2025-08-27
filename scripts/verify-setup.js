#!/usr/bin/env node

// CampEdge Setup Verification Script
// This script verifies that all components are working correctly

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🏕️  CampEdge Setup Verification');
console.log('================================');

let allChecksPass = true;

// Check Node.js version
console.log('\n📋 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 20) {
    console.log(`✅ Node.js ${nodeVersion} is compatible`);
} else {
    console.log(`❌ Node.js ${nodeVersion} is too old (requires 20+)`);
    allChecksPass = false;
}

// Check if essential files exist
console.log('\n📁 Checking project files...');
const essentialFiles = [
    'package.json',
    'src/main.tsx',
    'src/App.tsx',
    'src/types/index.ts',
    'src/services/api.ts',
    'src/data/camping_mock_data.json',
    'tailwind.config.js',
    'index.html'
];

essentialFiles.forEach(file => {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing`);
        allChecksPass = false;
    }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    const requiredDeps = [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'tailwindcss',
        'lucide-react',
        'vite'
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    requiredDeps.forEach(dep => {
        if (allDeps[dep]) {
            console.log(`✅ ${dep} v${allDeps[dep]}`);
        } else {
            console.log(`❌ ${dep} - Missing`);
            allChecksPass = false;
        }
    });
} catch (error) {
    console.log('❌ Failed to read package.json');
    allChecksPass = false;
}

// Check mock data
console.log('\n📊 Checking mock data...');
try {
    const mockData = JSON.parse(readFileSync(join(projectRoot, 'src/data/camping_mock_data.json'), 'utf8'));
    if (mockData.camps && mockData.camps.length > 0) {
        console.log(`✅ Found ${mockData.camps.length} camps in mock data`);
    } else {
        console.log('❌ No camps found in mock data');
        allChecksPass = false;
    }
} catch (error) {
    console.log('❌ Failed to read mock data');
    allChecksPass = false;
}

// Check TypeScript types
console.log('\n🔧 Checking TypeScript setup...');
try {
    const typesContent = readFileSync(join(projectRoot, 'src/types/index.ts'), 'utf8');
    if (typesContent.includes('interface Camp') && typesContent.includes('interface User')) {
        console.log('✅ TypeScript interfaces are defined');
    } else {
        console.log('❌ Missing essential TypeScript interfaces');
        allChecksPass = false;
    }
} catch (error) {
    console.log('❌ Failed to read TypeScript types');
    allChecksPass = false;
}

// Final result
console.log('\n' + '='.repeat(40));
if (allChecksPass) {
    console.log('🎉 All checks passed! Your setup is ready.');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:5173');
    console.log('3. Start building your camping platform!');
    process.exit(0);
} else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    console.log('\nTroubleshooting:');
    console.log('1. Run: ./scripts/fix-node-issues.sh');
    console.log('2. Or manually install missing dependencies');
    console.log('3. Check the README.md for more help');
    process.exit(1);
}
