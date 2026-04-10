import { ThemeCheck, CheckResult, FileMap } from '../types';

export class IncludedZipCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    for (const filename of Object.keys(otherFiles)) {
      if (filename.toLowerCase().endsWith('.zip')) {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Zip file found. Plugins are not allowed in themes. The zip file found was ${filename.split('/').pop()}.`,
          filename,
          ruleId: 'ThemeCheck.Licensing.IncludedZip',
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
