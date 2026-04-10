export type FileMap = Record<string, string>;

export interface CheckResult {
  type: 'ERROR' | 'WARNING' | 'INFO' | 'REQUIRED';
  message: string;
  filename: string;
  ruleId: string;
  line: number;
  column: number;
}

export interface ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[];
}
