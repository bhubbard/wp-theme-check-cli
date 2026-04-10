import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';
import path from 'path';

export class SearchFormCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'direct_include': { regex: /searchform\.php/g, message: 'Use get_search_form() instead of including searchform.php directly. Otherwise, the form can not be filtered.' },
    };

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const [ruleId, check] of Object.entries(checks)) {
        let match;
        // Don't flag searchform.php inclusion inside searchform.php itself? The regex in php checked all. Let's just do it.
        while ((match = check.regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `WARNING: searchform.php was found. ${check.message}`,
            filename,
            ruleId: `ThemeCheck.SearchForm.${ruleId}`,
            line,
            column
          });
        }
      }

      const basename = path.basename(filename);
      if (basename === 'searchform.php' || basename === 'product-searchform.php') {
        continue;
      }

      if (content.includes('role="search"')) {
        const index = content.indexOf('role="search"');
        const { line, column } = getLineAndColumn(content, index);
        results.push({
            type: 'WARNING',
            message: 'WARNING: role="search" was found. Use get_search_form() instead of hard coding forms. Otherwise, the form can not be filtered.',
            filename,
            ruleId: 'ThemeCheck.SearchForm.HardcodedSearch',
            line,
            column
        });
      }
    }

    return results;
  }
}
