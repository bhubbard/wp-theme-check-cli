import { ThemeCheck, CheckResult, FileMap } from '../types';

export class CopyrightNoticeCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    let content = '';
    const combinedFiles = { ...cssFiles, ...otherFiles };

    for (const [path, fileContent] of Object.entries(combinedFiles)) {
      const lowerPath = path.toLowerCase();
      if (lowerPath.includes('readme.txt') || 
          lowerPath.includes('readme.md') || 
          lowerPath.includes('style.css') || 
          lowerPath.includes('licence.txt')) {
        content += fileContent;
      }
    }

    if (!/[ \t\/*#]*Copyright/i.test(content) && !/[ \t\/*#]*\(C\)/i.test(content)) {
      const targetFile = Object.keys(combinedFiles).find(k => k.includes('style.css')) || 'style.css';
      results.push({
        type: 'WARNING',
        message: 'WARNING: Could not find a copyright notice for the theme. A copyright notice is needed if your theme is licenced as GPL.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Licensing.MissingCopyright',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
