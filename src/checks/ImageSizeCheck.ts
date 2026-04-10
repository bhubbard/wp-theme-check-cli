import { ThemeCheck, CheckResult, FileMap } from '../types';
import * as fs from 'fs';

export class ImageSizeCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    for (const [filename, content] of Object.entries(otherFiles)) {
      const lowerFilename = filename.toLowerCase();
      if (lowerFilename.endsWith('.png') || lowerFilename.endsWith('.jpg') || lowerFilename.endsWith('.jpeg') || lowerFilename.endsWith('.gif')) {
        try {
          const stats = fs.statSync(filename);
          if (stats.size > 500 * 1024) { // 500 KB
            results.push({
              type: 'WARNING',
              message: `WARNING: Image is ${(stats.size / 1024).toFixed(1)} KB in size. Large file sizes have a negative impact on website performance and loading time. Compress images before using them.`,
              filename,
              ruleId: 'ThemeCheck.Assets.LargeImage',
              line: 1,
              column: 1
            });
          }
        } catch (e) {
          // File might not exist directly if mocked, continue
        }
      }
    }

    return results;
  }
}
