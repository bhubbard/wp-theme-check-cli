import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class CustomizerCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    for (const [filename, content] of Object.entries(phpFiles)) {
      const regex = /\$wp_customize->add_setting\(([^;]+)/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const fullMatch = match[0];
        const args = match[1];
        
        const hasCallback = args.includes('sanitize_callback') || args.includes('sanitize_js_callback');
        const emptyCallbackRegex = /['"](?:sanitize_callback|sanitize_js_callback)['"]\s*=>\s*['"]\s*['"]/;

        if (!hasCallback) {
          const { line, column } = getLineAndColumn(content, match.index);
          const firstArg = args.split(',')[0].trim();
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Found a Customizer setting called ${firstArg} that did not have a sanitization callback function. Every call to add_setting() needs a sanitization callback.`,
            filename,
            ruleId: 'ThemeCheck.Customizer.MissingSanitization',
            line,
            column
          });
        } else if (emptyCallbackRegex.test(fullMatch)) {
          const { line, column } = getLineAndColumn(content, match.index);
          const firstArg = args.split(',')[0].trim();
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Found a Customizer setting called ${firstArg} that had an empty value passed as sanitization callback. You need to pass a function name.`,
            filename,
            ruleId: 'ThemeCheck.Customizer.EmptySanitization',
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
