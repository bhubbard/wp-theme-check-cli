import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class I18nCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const funcs = ['_e', '__', 'esc_attr__', 'esc_html__', 'esc_attr_e', 'esc_html_e'];

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const func of funcs) {
        // Regex to roughly find function calls that contain a variable $
        const regex = new RegExp(`\\b${func}\\s*\\(\\s*[^,)]*\\$[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*[^,)]*`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `RECOMMENDED: Possible variable found in translation function. Translation function calls must not contain PHP variables, use placeholders instead.`,
            filename,
            ruleId: `ThemeCheck.I18n.VariableInTranslation`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
