import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class LocalhostUrlCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const combinedFiles = { ...phpFiles, ...cssFiles, ...otherFiles };

    // Common local environment signatures
    const regex = /(https?:\/\/(localhost|127\.0\.0\.1|[\w-]+\.local|[\w-]+\.test)(:\d+)?\/)/gi;

    for (const [filename, content] of Object.entries(combinedFiles)) {
      // Don't check the READMEs or build log files
      if (filename.endsWith('.md') || filename.endsWith('.txt')) {
        continue;
      }

      let match;
      while ((match = regex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'WARNING',
          message: `WARNING: Found a hardcoded local development URL (${match[1]}). Ensure assets and links use relative WordPress functions like get_template_directory_uri() instead of absolute paths mapped to your local machine.`,
          filename,
          ruleId: 'ThemeCheck.Modern.HardcodedLocalhost',
          line,
          column
        });
      }
    }

    return results;
  }
}
