import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class IframeCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'iframe': { regex: /<iframe[^>]*>/i, message: 'iframes are sometimes used to load unwanted adverts and code on your site' },
    };

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const [ruleId, check] of Object.entries(checks)) {
        let match;
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'INFO',
            message: `INFO: ${match[0]} was found. ${check.message}.`,
            filename,
            ruleId: `ThemeCheck.Iframe.${ruleId}`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
