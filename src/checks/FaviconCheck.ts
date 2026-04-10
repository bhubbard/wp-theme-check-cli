import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class FaviconCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const checks = [
      /<link rel=['"](icon|shortcut icon|apple-touch-icon.*)['"]/gi,
      /<meta name=['"]msapplication-TileImage['"]/gi
    ];

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const regex of checks) {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'INFO',
            message: `INFO: Possible Favicon found. Favicons are handled by the Site Icon setting in the customizer since version 4.3.`,
            filename,
            ruleId: 'ThemeCheck.Assets.FaviconFound',
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
