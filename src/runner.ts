import fs from 'fs/promises';
import path from 'path';
import { ThemeCheck, CheckResult, FileMap } from './types';

export async function runChecks(themePath: string, checks: ThemeCheck[]): Promise<CheckResult[]> {
  const phpFiles: FileMap = {};
  const cssFiles: FileMap = {};
  const otherFiles: FileMap = {};

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        const content = await fs.readFile(fullPath, 'utf-8');
        const relativePath = path.relative(themePath, fullPath);
        
        if (ext === '.php') {
          phpFiles[relativePath] = content;
        } else if (ext === '.css') {
          cssFiles[relativePath] = content;
        } else {
          otherFiles[relativePath] = content;
        }
      }
    }
  }

  await walk(themePath);

  // Determine if it is a block theme (FSE) by checking for block templates
  const isBlockTheme = Object.keys(otherFiles).some(k => 
    k.includes('templates/index.html') || k.includes('block-templates/index.html')
  );

  const legacyChecksToSkip = [
    'NavMenuCheck',
    'CommentsCheck',
    'CommentPaginationCheck',
    'CommentReplyCheck',
    'PostThumbnailCheck',
    'CustomizerCheck',
    'EditorStyleCheck',
    'PostPaginationCheck',
    'PostFormatCheck',
    'WidgetsCheck',
    'AdminMenuCheck',
    'SearchFormCheck',
    'BasicCheck',
    'DeprecatedTitleTagCheck'
  ];

  let allResults: CheckResult[] = [];
  for (const check of checks) {
    if (isBlockTheme && legacyChecksToSkip.includes(check.constructor.name)) {
      continue;
    }
    allResults = allResults.concat(check.check(phpFiles, cssFiles, otherFiles));
  }

  return allResults;
}
