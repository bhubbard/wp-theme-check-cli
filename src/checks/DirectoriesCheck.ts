import { ThemeCheck, CheckResult, FileMap } from '../types';
import path from 'path';

export class DirectoriesCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const excludedDirectories = ['.git', '.svn', '.hg', '.bzr'];
    
    // In TS runner, directories are not directly passed as keys, only files.
    // However, if the runner traverses those hidden directories, their files will have `.git/` in the path.
    const allFiles = { ...phpFiles, ...cssFiles, ...otherFiles };

    for (const filePath of Object.keys(allFiles)) {
      const parts = filePath.split(path.sep);
      for (const excluded of excludedDirectories) {
        if (parts.includes(excluded)) {
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Please remove any extraneous directories like ${excluded} from the ZIP file before uploading it. Found file within target dir: ${filePath}`,
            filename: filePath,
            ruleId: 'ThemeCheck.Directories.Excluded',
            line: 1,
            column: 1
          });
          break; // Stop at first match for this file path
        }
      }
    }

    return results;
  }
}
