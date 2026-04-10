import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class DismissibleAdminNoticesCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    // Searches for HTML divs with class "notice" or "error" or "updated" which don't also contain "is-dismissible"
    // Since parsing HTML in regex is weak, we'll look for strings matching class="...notice..." and check if is-dismissible is present.
    const noticeRegex = /class\s*=\s*(['"])([^'"]*\bnotice\b[^'"]*)\1/g;

    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      while ((match = noticeRegex.exec(content)) !== null) {
        const fullClassString = match[2];
        if (!fullClassString.includes('is-dismissible')) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Admin notices must be dismissible. Found an admin notice class without the "is-dismissible" class.`,
            filename,
            ruleId: 'ThemeCheck.UX.UndismissibleNotice',
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
