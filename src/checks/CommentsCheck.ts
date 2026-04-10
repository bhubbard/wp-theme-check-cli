import { ThemeCheck, CheckResult, FileMap } from '../types';

export class CommentsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'comments_template': { regex: /comments_template\s*\(/i, message: 'Could not find comments_template.' },
      'wp_list_comments': { regex: /wp_list_comments\s*\(/i, message: 'Could not find wp_list_comments.' },
      'comment_form': { regex: /comment_form\s*\(/i, message: 'Could not find comment_form.' },
    };

    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (Object.keys(phpFiles).length > 0) {
      for (const [ruleId, check] of Object.entries(checks)) {
        if (!check.regex.test(allPhpContent)) {
          results.push({
            type: 'WARNING',
            message: `RECOMMENDED: ${check.message}`,
            filename: targetFile,
            ruleId: `ThemeCheck.Comments.${ruleId}`,
            line: 1,
            column: 1
          });
        }
      }
    }

    return results;
  }
}
