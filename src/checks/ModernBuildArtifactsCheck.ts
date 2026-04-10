import { ThemeCheck, CheckResult, FileMap } from '../types';
import * as path from 'path';

export class ModernBuildArtifactsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const combinedFiles = Object.keys({ ...phpFiles, ...cssFiles, ...otherFiles });

    const blockedFiles = [
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'webpack.config.js',
        'tsconfig.json',
        'tailwind.config.js',
        'postcss.config.js',
        'gulpfile.js',
        'gruntfile.js',
        '.prettierrc',
        '.eslintrc',
        '.nvmrc',
        '.env'
    ];

    const blockedDirs = [
        'node_modules',
        '.github',
        '.husky',
        '.vscode',
        '.idea',
        'src', // typical development src folder check
        '__MACOSX'
    ];

    for (const filename of combinedFiles) {
      const parts = filename.split('/');
      const basename = path.basename(filename).toLowerCase();
      
      // Check restricted exact files
      if (blockedFiles.includes(basename)) {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found development configuration file: ${basename}. This file must be excluded from the distributed production theme bundle.`,
          filename,
          ruleId: 'ThemeCheck.Modern.BuildArtifact',
          line: 1,
          column: 1
        });
      }

      // Check restricted directories anywhere in the path
      for (const dir of blockedDirs) {
        if (parts.includes(dir)) {
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Found development directory: ${dir}/. This entire directory should be excluded from the distributed production theme bundle.`,
            filename,
            ruleId: 'ThemeCheck.Modern.BuildDirectory',
            line: 1,
            column: 1
          });
          break; // only report one restricted directory block per file
        }
      }
    }

    return results;
  }
}
