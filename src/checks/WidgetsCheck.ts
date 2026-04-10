import { ThemeCheck, CheckResult, FileMap } from '../types';

export class WidgetsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const hasRegisterSidebar = allPhpContent.includes('register_sidebar');
    const hasDynamicSidebar = allPhpContent.includes('dynamic_sidebar');
    const hasWidgetsInit = /add_action\s*\(\s*("|')widgets_init("|')\s*,/.test(allPhpContent);

    // Fallback file context is index.php or functions.php, typically functions is preferred for these errors
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (!hasRegisterSidebar && !hasDynamicSidebar) {
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: This theme contains no sidebars/widget areas. See Widgets API',
        filename: targetFile,
        ruleId: 'ThemeCheck.Widgets.NoWidgets',
        line: 1,
        column: 1
      });
    }

    if (hasRegisterSidebar && !hasDynamicSidebar) {
      results.push({
        type: 'REQUIRED',
        message: 'REQUIRED: The theme appears to use register_sidebar() but no dynamic_sidebar() was found.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Widgets.MissingDynamicSidebar',
        line: 1,
        column: 1
      });
    }

    if (!hasRegisterSidebar && hasDynamicSidebar) {
      results.push({
        type: 'REQUIRED',
        message: 'REQUIRED: The theme appears to use dynamic_sidebar() but no register_sidebar() was found.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Widgets.MissingRegisterSidebar',
        line: 1,
        column: 1
      });
    }

    if (hasRegisterSidebar && !hasWidgetsInit) {
      results.push({
        type: 'REQUIRED',
        message: 'REQUIRED: Sidebars need to be registered in a custom function hooked to the widgets_init action.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Widgets.MissingWidgetsInit',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
