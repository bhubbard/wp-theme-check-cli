import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class JQueryUsageCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    // Match wp_enqueue_script('jquery') or array('jquery') dependencies in enqueues
    const jqueryRegex = /wp_enqueue_script\s*\(\s*['"]jquery['"]/g;
    const dependencyRegex = /wp_(enqueue|register)_script\s*\([^,]+,\s*[^,]+,\s*array\s*\([^)]*['"]jquery['"][^)]*\)/g;

    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      
      while ((match = jqueryRegex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `INFO: Found jQuery being explicitly enqueued. While permitted, modern WordPress themes should avoid loading jQuery on the frontend unless absolutely necessary for backwards compatibility. Consider using vanilla JavaScript.`,
          filename,
          ruleId: 'ThemeCheck.Performance.JQueryUsage',
          line,
          column
        });
      }

      while ((match = dependencyRegex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `INFO: Found jQuery defined as a script dependency. While permitted, modern WordPress themes should avoid relying on jQuery on the frontend. Consider refactoring to vanilla JavaScript (https://youmightnotneedjquery.com/).`,
          filename,
          ruleId: 'ThemeCheck.Performance.JQueryDependency',
          line,
          column
        });
      }
    }

    return results;
  }
}
