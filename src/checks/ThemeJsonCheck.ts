import { ThemeCheck, CheckResult, FileMap } from '../types';

export class ThemeJsonCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    
    const themeJsonPath = Object.keys(otherFiles).find(k => k.endsWith('theme.json'));

    if (themeJsonPath) {
      const content = otherFiles[themeJsonPath];
      
      try {
        const parsed = JSON.parse(content);
        
        if (!parsed.$schema) {
          results.push({
            type: 'WARNING',
            message: 'RECOMMENDED: theme.json does not contain a "$schema" value. Including the schema provides IDE autocompletion and validation for developers.',
            filename: themeJsonPath,
            ruleId: 'ThemeCheck.FSE.MissingSchema',
            line: 1,
            column: 1
          });
        }
      } catch (error: any) {
        // Find rough line number by counting line breaks up to the error index if the error message provides it (e.g., SyntaxError: Unexpected token } in JSON at position 123)
        // V8 JSON parse errors sometimes contain position
        let line = 1;
        let column = 1;
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const index = parseInt(match[1], 10);
          const upToIndex = content.substring(0, index);
          const lines = upToIndex.split('\n');
          line = lines.length;
          column = lines[lines.length - 1].length + 1;
        }

        results.push({
          type: 'ERROR',
          message: `REQUIRED: theme.json is completely invalid and cannot be parsed. WordPress will fail to load this Block Theme. Syntax Error: ${error.message}`,
          filename: themeJsonPath,
          ruleId: 'ThemeCheck.FSE.InvalidThemeJson',
          line,
          column
        });
      }
    }

    return results;
  }
}
