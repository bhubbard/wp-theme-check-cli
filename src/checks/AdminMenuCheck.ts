import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class AdminMenuCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'userLevelsAddPage': { regex: /([^_](add_(admin|submenu|menu|dashboard|posts|media|links|pages|comments|theme|plugins|users|management|options)_page)\s?\([^,]*,[^,]*,\s['|"]?(level_[0-9]|[0-9])[^;|\r|\n]*)/g, message: 'User levels were deprecated in 2.0. Please see Roles and Capabilities' },
      'userLevelsCurrentUser': { regex: /[^a-z0-9](current_user_can\s?\(\s?['"]level_[0-9]['"]\s?\))[^\r|\n]*/g, message: 'User levels were deprecated in 2.0. Please see Roles and Capabilities' },
    };

    const allowedAddPages = ['add_theme_page', 'add_menu_page', 'add_submenu_page'];

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const [ruleId, check] of Object.entries(checks)) {
        let match;
        const regex = new RegExp(check.regex);
        
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `WARNING: ${check.message}`,
            filename,
            ruleId: `ThemeCheck.AdminMenu.DeprecatedUserLevel`,
            line,
            column
          });
        }
      }

      // Check for add_admin_page's, except for allowed ones.
      let match;
      const addPageRegex = /(?<!function)[^_>:](add_[a-z]+_page)/g;
      while ((match = addPageRegex.exec(content)) !== null) {
        if (!allowedAddPages.includes(match[1])) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `RECOMMENDED: Themes should not use ${match[1]}().`,
            filename,
            ruleId: `ThemeCheck.AdminMenu.DisallowedAddPage`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
