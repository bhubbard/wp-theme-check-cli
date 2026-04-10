import { ThemeCheck, CheckResult, FileMap } from '../types';
import path from 'path';

export class FileCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    
    // PHP implementation extracts basenames, but we need full path conceptually for output.
    // The previous check just checked basenames for blocklist.
    const allFiles = { ...phpFiles, ...cssFiles, ...otherFiles };
    const filenamesLower = Object.keys(allFiles).map(f => path.basename(f).toLowerCase());

    const allowlist = ['wpml-config.xml', 'loco.xml', 'phpcs.xml'];

    const blocklist: Record<string, string> = {
      'thumbs\\.db': 'Windows thumbnail store',
      'desktop\\.ini': 'windows system file',
      'project\\.properties': 'NetBeans Project File',
      'project\\.xml': 'NetBeans Project File',
      '\\.kpf': 'Komodo Project File',
      '^\\.+[a-z0-9]': 'Hidden Files or Folders',
      'php\\.ini': 'PHP server settings file',
      'dwsync\\.xml': 'Dreamweaver project file',
      'error_log': 'PHP error log',
      'web\\.config': 'Server settings file',
      '\\.sql': 'SQL dump file',
      '__macosx': 'OSX system file',
      '\\.lubith': 'Lubith theme generator file',
      '\\.wie': 'Widget import file',
      '\\.dat': 'Customizer import file',
      '\\.xml': 'XML file',
      '\\.sh': 'Shell script file',
      'favicon\\.ico': 'Favicon',
    };

    let musthave = ['index.php', 'style.css', 'readme.txt'];

    const fseFind = Object.keys(otherFiles).filter(fileName => {
      const lower = fileName.toLowerCase();
      return lower.includes('templates/index.html') || lower.includes('block-templates/index.html');
    });

    if (fseFind.length > 0) {
      musthave = musthave.filter(f => f !== 'index.php');
    }

    const actualFilesSet = new Set(filenamesLower);

    for (const [regexStr, reason] of Object.entries(blocklist)) {
      const regex = new RegExp(regexStr, 'i');
      const matches = Object.keys(allFiles).filter(f => regex.test(path.basename(f)));
      
      const filteredMatches = matches.filter(f => {
        const lowerBase = path.basename(f).toLowerCase();
        return !allowlist.includes(lowerBase);
      });

      if (filteredMatches.length > 0) {
        for (const matchFile of filteredMatches) {
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: ${matchFile} found. This file must not be in the production version of the theme. Reason: ${reason}`,
            filename: matchFile,
            ruleId: `ThemeCheck.Files.Blocklist`,
            line: 1,
            column: 1
          });
        }
      }
    }

    const actualFilesBasenames = Object.keys(allFiles).map(f => path.basename(f));
    for (const requiredFile of musthave) {
      if (!actualFilesBasenames.includes(requiredFile)) {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Could not find the file ${requiredFile} in the theme.`,
          filename: 'theme-root',
          ruleId: `ThemeCheck.Files.MustHave`,
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
