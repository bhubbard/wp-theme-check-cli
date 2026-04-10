import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class DeprecatedTitleTagCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const titleRegex = /<title[^>]*>[\s\S]*?<\/title>/gi;

    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      while ((match = titleRegex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found a hardcoded <title> tag. Since WordPress 4.1, manual title tags are explicitly discouraged. Use add_theme_support('title-tag') inside your functions.php instead.`,
          filename,
          ruleId: 'ThemeCheck.Deprecated.HardcodedTitleTag',
          line,
          column
        });
      }
    }

    return results;
  }
}
