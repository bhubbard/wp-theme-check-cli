import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class NonPrintableCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    // 09 = tab
    // 0A = line feed
    // 0D = new line
    // Look for anything in the control character range outside of those
    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      const regex = /[\x00-\x08\x0B-\x0C\x0E-\x1F]/g;
      
      while ((match = regex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Non-printable characters were found. You may want to check this file for errors.`,
          filename,
          ruleId: `ThemeCheck.File.NonPrintable`,
          line,
          column
        });
      }
    }

    return results;
  }
}
