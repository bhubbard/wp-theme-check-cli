import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class PostFormatCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');
    const allCssContent = Object.values(cssFiles).join(' ');

    const checks = [/add_theme_support\(\s?("|')post-formats("|')/gm];

    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const check of checks) {
        let match;
        // Use a new regex instance to reset state
        const regex = new RegExp(check);
        
        while ((match = regex.exec(content)) !== null) {
          if (!allPhpContent.includes('get_post_format') && 
              !allPhpContent.includes('has_post_format') && 
              !allCssContent.includes('.format')) {
                
            const { line, column } = getLineAndColumn(content, match.index);
            results.push({
              type: 'INFO',
              message: `INFO: ${match[0].replace(/['"]/g, '')} was found. However get_post_format and/or has_post_format were not found, and no use of formats in the CSS was detected.`,
              filename,
              ruleId: 'ThemeCheck.Posts.UnusedPostFormats',
              line,
              column
            });
          }
        }
      }
    }

    return results;
  }
}
