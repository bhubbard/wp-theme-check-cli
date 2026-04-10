import { ThemeCheck, CheckResult, FileMap } from '../types';
import path from 'path';

export class ScreenshotCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    let hasScreenshot = false;

    // Use functions.php as a fallback filename for missing errors
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    for (const filename of Object.keys(otherFiles)) {
      const basename = path.basename(filename).toLowerCase();
      if (basename === 'screenshot.png' || basename === 'screenshot.jpg') {
        hasScreenshot = true;
        
        // Since we can't trivially check dimension sizes of an image purely using standard JS without an external module like `sharp`,
        // We will output a RECOMMENDED note pointing out the preferred size.
        results.push({
          type: 'WARNING',
          message: 'RECOMMENDED: Screenshot size should be 1200x900, to account for HiDPI displays. Any 4:3 image size is acceptable, but 1200x900 is preferred.',
          filename,
          ruleId: 'ThemeCheck.Assets.ScreenshotSizeRecommended',
          line: 1,
          column: 1
        });
      }
    }

    if (!hasScreenshot) {
      results.push({
        type: 'REQUIRED',
        message: 'REQUIRED: No screenshot detected! Please include a screenshot.png or screenshot.jpg.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Assets.MissingScreenshot',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
