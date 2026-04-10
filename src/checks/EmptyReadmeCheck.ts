import { ThemeCheck, CheckResult, FileMap } from '../types';

export class EmptyReadmeCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    
    // Find readme files (readme.txt or readme.md)
    const readmeFiles = Object.keys(otherFiles).filter(k => 
      k.toLowerCase().endsWith('readme.txt') || k.toLowerCase().endsWith('readme.md')
    );

    for (const filename of readmeFiles) {
      const content = otherFiles[filename];
      // Check if file is completely empty or just whitespace
      if (!content || content.trim() === '') {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: The ${filename.split('/').pop()} file is empty.`,
          filename,
          ruleId: 'ThemeCheck.Files.EmptyReadme',
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
