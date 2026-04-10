import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class PhpShortTagsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      const regex = /<\?(\=?)(?!php|xml)/gi;
      
      while ((match = regex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Found PHP short tags in file.`,
          filename,
          ruleId: `ThemeCheck.Tags.PhpShortTags`,
          line,
          column
        });
      }
    }

    return results;
  }
}
