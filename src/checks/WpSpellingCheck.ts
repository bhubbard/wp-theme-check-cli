import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class WpSpellingCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const combinedFiles = { ...phpFiles, ...cssFiles, ...otherFiles };

    // Regex to match "wordpress", "wordpres", "word press" but NOT "WordPress"
    // Also ensuring we skip URLs or package names by keeping it roughly bounded by non-alphanumeric, but this can be tricky.
    // GitHub PR 488 checks for: wordpress, wordpres, word press.
    const badSpellings = /\b(wordpress|wordpres|word\spress)\b/g;

    for (const [filename, content] of Object.entries(combinedFiles)) {
      // Avoid checking certain files where lowercase might be valid (URLs, etc)
      if (filename.includes('node_modules') || filename.includes('vendor')) {
        continue;
      }

      let match;
      while ((match = badSpellings.exec(content)) !== null) {
        // Skip if it looks like a URL, a package name or an email
        const surroundingText = content.substring(Math.max(0, match.index - 10), Math.min(content.length, match.index + 20));
        if (surroundingText.includes('http') || surroundingText.includes('@') || surroundingText.includes('npm') || surroundingText.match(/[-_]/)) {
            continue;
        }

        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found incorrect spelling or capitalization of WordPress ("${match[1]}"). Always use WordPress in text.`,
          filename,
          ruleId: 'ThemeCheck.Content.WpSpelling',
          line,
          column
        });
      }
    }

    return results;
  }
}
