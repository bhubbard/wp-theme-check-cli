import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class DebugCodeCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const combinedFiles = { ...phpFiles, ...otherFiles };

    // Matches var_dump, print_r (when used as statements), and console.log
    const debugRegex = /\b(var_dump|error_log|console\.log|console\.debug)\s*\(/g;
    const printRRegex = /\b(print_r)\s*\([^,]+(?!\s*,\s*true)\)/g;

    for (const [filename, content] of Object.entries(combinedFiles)) {
      if (filename.includes('node_modules') || filename.includes('vendor')) {
        continue;
      }

      let match;
      while ((match = debugRegex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Found debug code (${match[1]}). Ensure you are not leaking debugging information or inflating the execution stack in the production theme.`,
          filename,
          ruleId: 'ThemeCheck.CodeQuality.DebugStatement',
          line,
          column
        });
      }

      while ((match = printRRegex.exec(content)) !== null) {
        // print_r without the return parameter set to true is usually logging.
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Found print_r() which is typically used for debugging. Outputting unescaped arrays directly to the window breaks layouts and poses a security risk.`,
          filename,
          ruleId: 'ThemeCheck.CodeQuality.PrintR',
          line,
          column
        });
      }
    }

    return results;
  }
}
