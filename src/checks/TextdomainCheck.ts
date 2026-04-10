import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class TextdomainCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const domains: Set<string> = new Set();
    const funcs = ['__', '_e', 'esc_attr__', 'esc_html__', 'esc_attr_e', 'esc_html_e'];

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const func of funcs) {
        // Broad regex to match typical domain usage e.g. __('String', 'textdomain')
        const regex = new RegExp(`\\b${func}\\s*\\(\\s*['"][^'"]*['"]\\s*,\\s*(['"])(.*?)\\1`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
          domains.add(match[2]);
        }
        
        // Also check missing domains
        const noDomainRegex = new RegExp(`\\b${func}\\s*\\(\\s*['"][^'"]*['"]\\s*\\)(?!\\s*[;,])`, 'g');
        while ((match = noDomainRegex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `WARNING: Found a translation function that is missing a text-domain. Function ${func}.`,
            filename,
            ruleId: `ThemeCheck.Textdomain.MissingDomain`,
            line,
            column
          });
        }
      }
    }

    const domainlist = Array.from(domains).join(', ');
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (domains.size > 1) {
      results.push({
        type: 'WARNING',
        message: `WARNING: More than one text-domain is being used in this theme. The domains found are ${domainlist}.`,
        filename: targetFile,
        ruleId: 'ThemeCheck.Textdomain.MultipleDomains',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
