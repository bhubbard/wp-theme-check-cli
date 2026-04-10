import fs from 'fs';
import path from 'path';

const checks = [
  'StyleTagsCheck', 'ScriptTagCheck', 'SuggestedStylesCheck', 'GravatarCheck', 'BlockPatternsCheck', 'FseRequiredFilesCheck', 'DeprecatedCheck', 'DeprecatedParamCheck', 'ConstantsCheck', 'LineEndingsCheck', 'TagCheck', 'TimeDateCheck', 'TitleCheck', 'UnderscoresCheck', 'UriCheck', 'SiteUrlCheck', 'LinkCheck', 'IncludeCheck', 'NoHiddenAdminBarCheck', 'ScreenReaderTextCheck', 'GeneratedCheck'
];

for (const check of checks) {
  const content = `import { ThemeCheck, CheckResult, FileMap } from '../types';\nimport { getLineAndColumn } from '../utils';\n\nexport class ${check} implements ThemeCheck {\n  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {\n    const results: CheckResult[] = [];\n    // TODO: Port regex rules for ${check}\n    return results;\n  }\n}\n`;
  fs.writeFileSync(path.join(__dirname, 'src/checks', `${check}.ts`), content);
}
