import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class WormsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allFilesToSearch = { ...phpFiles, ...otherFiles };

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'wshell': { regex: /wshell\.php/, message: 'This may be a script used by hackers to get control of your server!' },
      'shellbot': { regex: /ShellBOT/, message: 'This may be a script used by hackers to get control of your server' },
      'uname': { regex: /uname -a/, message: 'Tells a hacker what operating system your server is running' },
      'pharma1': { regex: /php \$[a-zA-z]*='as';/, message: 'Symptom of the "Pharma Hack"' },
      'pharma2': { regex: /defined?\('wp_class_support/, message: 'Symptom of the "Pharma Hack"' },
    };

    for (const [filename, content] of Object.entries(allFilesToSearch)) {
      for (const [ruleId, check] of Object.entries(checks)) {
        let match;
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: ${check.message}. Found: ${match[0]}`,
            filename,
            ruleId: `ThemeCheck.Worms.${ruleId}`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
