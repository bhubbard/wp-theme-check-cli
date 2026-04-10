export function getLineAndColumn(content: string, matchIndex: number): { line: number, column: number } {
  const textBeforeMatch = content.substring(0, matchIndex);
  const lines = textBeforeMatch.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

export function formatAsPHPCS(results: import('./types').CheckResult[]): string {
  const output: any = {
    totals: { errors: 0, warnings: 0, fixable: 0 },
    files: {}
  };

  for (const res of results) {
    if (!output.files[res.filename]) {
      output.files[res.filename] = {
        errors: 0,
        warnings: 0,
        messages: []
      };
    }

    const typeStr = res.type === 'ERROR' || res.type === 'REQUIRED' ? 'ERROR' : 'WARNING';

    if (typeStr === 'ERROR') {
      output.totals.errors++;
      output.files[res.filename].errors++;
    } else {
      output.totals.warnings++;
      output.files[res.filename].warnings++;
    }

    output.files[res.filename].messages.push({
      message: res.message,
      source: res.ruleId,
      severity: typeStr === 'ERROR' ? 5 : 3,
      fixable: false,
      type: typeStr,
      line: res.line,
      column: res.column
    });
  }

  return JSON.stringify(output, null, 2);
}
