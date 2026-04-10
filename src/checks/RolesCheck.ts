import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class RolesCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    // Detect hardcoded WP roles in capability checks like current_user_can('administrator')
    // WordPress best practice requires checking for specific capabilities (e.g. 'manage_options') rather than roles.
    const rolesRegex = /current_user_can\s*\(\s*['"](administrator|editor|author|contributor|subscriber)['"]\s*\)/g;

    for (const [filename, content] of Object.entries(phpFiles)) {
      let match;
      while ((match = rolesRegex.exec(content)) !== null) {
        const { line, column } = getLineAndColumn(content, match.index);
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found a capability check relying on a role ("${match[1]}"). You must use capabilities (e.g. "edit_theme_options" or "manage_options") for determining user permissions, rather than relying on role names.`,
          filename,
          ruleId: 'ThemeCheck.Security.HardcodedRole',
          line,
          column
        });
      }
    }

    return results;
  }
}
