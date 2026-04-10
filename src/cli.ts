#!/usr/bin/env bun
import { runChecks } from './runner';
import { formatAsPHPCS } from './utils';
import * as fs from 'fs';
import * as path from 'path';

import type { ThemeCheck } from './types';

async function main() {
  const args = process.argv.slice(2);
  let themePath = process.cwd();
  let format = 'text';

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 WordPress Theme Check CLI
A high-performance TypeScript tool for auditing WordPress distributions.

USAGE:
  wp-theme-check [options] [path]

OPTIONS:
  --path <path>      The path to the WordPress theme directory (default: current directory)
  --format <format>  Output format: "text" or "json" (default: text)
  -h, --help         Show this help message

EXAMPLES:
  wp-theme-check --path ./my-theme
  wp-theme-check --path ./my-theme --format json | jq '.totals'
    `);
    process.exit(0);
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path') {
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        themePath = args[i + 1];
        i++;
      } else {
        console.error("Error: --path argument requires a path value.");
        process.exit(1);
      }
    } else if (args[i] === '--format') {
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        format = args[i + 1];
        i++;
      }
    }
  }

  // Register all checks dynamically
  const checks: ThemeCheck[] = [];
  const checksDir = path.join(__dirname, 'checks');
  const checkFiles = fs.readdirSync(checksDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

  for (const file of checkFiles) {
    try {
      const exportedModule = await import(path.join(checksDir, file));
      const ClassConstructor = Object.values(exportedModule)[0] as new () => ThemeCheck;
      if (typeof ClassConstructor === 'function') {
        checks.push(new ClassConstructor());
      }
    } catch (e) {
      console.warn(`Could not load check module: ${file}`);
    }
  }

  try {
    const results = await runChecks(themePath, checks);

    if (format === 'json') {
      console.log(formatAsPHPCS(results));
    } else {
      // Basic text output
      if (results.length === 0) {
        console.log("No issues found.");
      } else {
        results.forEach(res => {
          console.log(`[${res.type}] ${res.filename}:${res.line}:${res.column} - ${res.message} (${res.ruleId})`);
        });
      }
    }
    
    // Exit with code 1 if there are any ERRORs
    const hasErrors = results.some(r => r.type === 'ERROR' || r.type === 'REQUIRED');
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    console.error("Error running checks:", error);
    process.exit(1);
  }
}

main();
