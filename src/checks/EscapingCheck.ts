import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class EscapingCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const warnings: Record<string, { regex: RegExp, message: string }> = {
      'escHtmlE': { regex: /="<\?php esc_html_e/, message: 'Use esc_attr_e() inside HTML attributes, and esc_url() for link attributes' },
      'escHtml__': { regex: /="<\?php echo esc_html__/, message: 'Use esc_attr__() inside HTML attributes, and esc_url() for link attributes' },
      'escHtml': { regex: /="<\?php esc_html\(/, message: 'Use esc_attr() inside HTML attributes, and esc_url() for link attributes' },
      'escAttr': { regex: /><\?php echo esc_attr\(/, message: 'Only use esc_attr() inside HTML attributes. Use esc_html() between HTML tags' },
      'escAttr__': { regex: /><\?php echo esc_attr__/, message: 'Only use esc_attr__() inside HTML attributes. Use esc_html__() between HTML tags' },
      'escAttrE': { regex: /><\?php esc_attr_e/, message: 'Only use esc_attr_e() inside HTML attributes. Use esc_html_e() between HTML tags' },
    };

    const required: Record<string, { regex: RegExp, message: string }> = {
      'homeUrl': { regex: /echo home_url/, message: 'home_url() must be escaped. Use esc_url() for link attributes' },
      'templateDirUri': { regex: /echo get_template_directory_uri/, message: 'get_template_directory_uri() must be escaped when output as part of a link or image source. Use esc_url() for link attributes' },
    };

    for (const [filename, content] of Object.entries(phpFiles)) {
      if (content.includes('echo get_theme_mod')) {
        const index = content.indexOf('echo get_theme_mod');
        const { line, column } = getLineAndColumn(content, index);
        results.push({
          type: 'WARNING',
          message: 'WARNING: Found echo get_theme_mod. Theme options must be escaped. A manual review is needed.',
          filename,
          ruleId: 'ThemeCheck.Escaping.themeMod',
          line,
          column
        });
      }

      for (const [ruleId, check] of Object.entries(warnings)) {
        let match;
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'WARNING',
            message: `WARNING: Found ${match[0].trim()}. ${check.message}. A manual review is needed.`,
            filename,
            ruleId: `ThemeCheck.Escaping.${ruleId}`,
            line,
            column
          });
        }
      }

      for (const [ruleId, check] of Object.entries(required)) {
        let match;
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: Found ${match[0].trim()}. ${check.message}. A manual review is needed.`,
            filename,
            ruleId: `ThemeCheck.Escaping.${ruleId}`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
