import { ThemeCheck, CheckResult, FileMap } from '../types';

export class BasicCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const checks: Record<string, { regex: RegExp, message: string }> = {
      'DOCTYPE': { regex: /DOCTYPE/i, message: 'Could not find DOCTYPE.' },
      'wpBodyOpen': { regex: /(wp_body_open\s*\()|(do_action\s*\(\s*["']wp_body_open)/i, message: 'Could not find wp_body_open action or function call at the very top of the body just after the opening body tag.' },
      'wpFooter': { regex: /wp_footer\s*\(/i, message: 'Could not find wp_footer.' },
      'wpHead': { regex: /wp_head\s*\(/i, message: 'Could not find wp_head.' },
      'languageAttributes': { regex: /language_attributes/i, message: 'Could not find language_attributes.' },
      'charset': { regex: /charset/i, message: 'There must be a charset defined in the Content-Type or the meta charset tag in the head.' },
      'automaticFeedLinks': { regex: /add_theme_support\s*\(\s?("|')automatic-feed-links("|')\s?\)/i, message: 'Could not find add_theme_support( "automatic-feed-links" ).' },
      'bodyClass': { regex: /body_class\s*\(/i, message: 'Could not find body_class.' },
      'wpLinkPages': { regex: /wp_link_pages\s*\(/i, message: 'Could not find wp_link_pages.' },
      'postClass': { regex: /post_class\s*\(/i, message: 'Could not find post_class.' }
    };

    if (Object.keys(phpFiles).length > 0) {
      for (const [ruleId, check] of Object.entries(checks)) {
        if (!check.regex.test(allPhpContent)) {
          results.push({
            type: 'ERROR',
            message: `REQUIRED: ${check.message}`,
            filename: 'functions.php',
            ruleId: `ThemeCheck.Basic.${ruleId}`,
            line: 1,
            column: 1
          });
        }
      }
    }

    return results;
  }
}
