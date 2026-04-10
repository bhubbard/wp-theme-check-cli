import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';
import path from 'path';

export class NavMenuCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');
    
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (!allPhpContent.includes('nav_menu')) {
      results.push({
        type: 'WARNING',
        message: "RECOMMENDED: No reference to nav_menu's was found in the theme. Note that if your theme has a menu bar, it is required to use the WordPress nav_menu functionality for it.",
        filename: targetFile,
        ruleId: 'ThemeCheck.NavMenu.NoNavMenu',
        line: 1,
        column: 1
      });
    }

    if (/add_theme_support\s*\(\s?("|')menus("|')\s?\)/.test(allPhpContent)) {
      results.push({
        type: 'REQUIRED',
        message: 'REQUIRED: Reference to add_theme_support("menus") was found. This should be removed and register_nav_menus() used instead.',
        filename: targetFile,
        ruleId: 'ThemeCheck.NavMenu.DeprecatedSupport',
        line: 1,
        column: 1
      });
    }

    for (const [filename, content] of Object.entries(phpFiles)) {
      let wpNavMenuIndex = content.indexOf('wp_nav_menu(');
      
      while (wpNavMenuIndex !== -1) {
        const { line, column } = getLineAndColumn(content, wpNavMenuIndex);
        const endOfStatement = content.indexOf(';', wpNavMenuIndex);
        const statement = endOfStatement !== -1 ? content.substring(wpNavMenuIndex, endOfStatement) : content.substring(wpNavMenuIndex);
        
        let nameCheck = false;
        
        if (statement.includes('$') && !statement.includes('theme_location')) {
           results.push({
            type: 'WARNING',
            message: 'WARNING: A menu without a theme_location was found. A variable is used inside wp_nav_menu(). You must manually check if the theme_location is included.',
            filename,
            ruleId: 'ThemeCheck.NavMenu.VariableWithoutLocation',
            line,
            column
          });
          nameCheck = true;
        } else if (!statement.includes('theme_location')) {
          results.push({
            type: 'REQUIRED',
            message: 'REQUIRED: A menu without a theme_location was found.',
            filename,
            ruleId: 'ThemeCheck.NavMenu.MissingThemeLocation',
            line,
            column
          });
          nameCheck = true;
        }

        if (nameCheck && /("|')menu("|').*?=>/.test(statement)) {
          results.push({
            type: 'REQUIRED',
            message: 'REQUIRED: A menu name is being used. By using menu name, the menu would be required to have the exact same name in the WordPress admin area. Use a theme_location instead.',
            filename,
            ruleId: 'ThemeCheck.NavMenu.UsesMenuName',
            line,
            column
          });
        }
        
        wpNavMenuIndex = content.indexOf('wp_nav_menu(', wpNavMenuIndex + 1);
      }
    }

    return results;
  }
}
