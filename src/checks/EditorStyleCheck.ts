import { ThemeCheck, CheckResult, FileMap } from '../types';

export class EditorStyleCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (!allPhpContent.includes('add_editor_style')) {
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: No reference to add_editor_style() was found in the theme. It is recommended that the theme implement editor styling, so as to make the editor content match the resulting post output in the theme, for a better user experience.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Assets.MissingEditorStyle',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
