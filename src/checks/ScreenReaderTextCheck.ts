import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class ScreenReaderTextCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    // TODO: Port regex rules for ScreenReaderTextCheck
    return results;
  }
}
