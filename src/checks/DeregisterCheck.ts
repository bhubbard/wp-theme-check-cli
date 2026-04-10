import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class DeregisterCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    for (const [filename, content] of Object.entries(phpFiles)) {
      if (content.includes('wp_deregister_script')) {
        const index = content.indexOf('wp_deregister_script');
        const { line, column } = getLineAndColumn(content, index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Found wp_deregister_script. Themes must not deregister scripts that are included in WordPress. Deregistering third party scripts that are registered by parent themes is allowed.`,
          filename,
          ruleId: 'ThemeCheck.Assets.DeregisterScript',
          line,
          column
        });
      }
    }

    return results;
  }
}
