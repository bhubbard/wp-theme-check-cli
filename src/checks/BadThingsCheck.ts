import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class BadThingsCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const phpChecks: Record<string, { regex: RegExp, message: string }> = {
      'eval': { regex: /(?<![_|a-z0-9|\.])eval\s?\(/i, message: 'eval() is not allowed.' },
      'systemCalls': { regex: /[^a-z0-9](?<!_)(popen|proc_open|[^_]exec|shell_exec|system|passthru)\(/i, message: 'PHP system calls are often disabled by server admins and should not be in themes' },
      'iniSet': { regex: /\s?ini_set\(/, message: 'Themes should not change server PHP settings' },
      'base64Decode': { regex: /base64_decode/, message: 'base64_decode() is not allowed' },
      'base64Encode': { regex: /base64_encode/, message: 'base64_encode() is not allowed' },
      'uudecode': { regex: /uudecode/im, message: 'uudecode() is not allowed' },
      'strRot13': { regex: /str_rot13/im, message: 'str_rot13() is not allowed' },
      'googleSearch': { regex: /cx=[0-9]{21}:[a-z0-9]{10}/, message: 'Google search code detected' },
      'googleAds': { regex: /pub-[0-9]{16}/i, message: 'Google advertising code detected' },
      'shareSale': { regex: /sharesale/i, message: 'Sharesale affiliate link detected' },
      'affiliateId': { regex: /affiliate_id/i, message: 'Potential affiliate link detected' },
      'partnerId': { regex: /(elementor_partner_id)|(wpbeaverbuilder.*?fla)/i, message: 'Potential affiliate link detected' }
    };

    const otherChecks: Record<string, { regex: RegExp, message: string }> = {
      'googleSearch': { regex: /cx=[0-9]{21}:[a-z0-9]{10}/, message: 'Google search code detected' },
      'googleAds': { regex: /pub-[0-9]{16}/i, message: 'Google advertising code detected' }
    };

    // Run PHP file checks
    for (const [filename, content] of Object.entries(phpFiles)) {
      for (const [ruleId, check] of Object.entries(phpChecks)) {
        // Find all matches
        let match;
        // Need to use global flag to find all, but the original regexes aren't global.
        // We'll clone and add 'g' flag.
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: check.message + ` Found: ${match[0].trim()}`,
            filename,
            ruleId: `ThemeCheck.BadThings.${ruleId}`,
            line,
            column
          });
        }
      }
    }

    // Run other file checks
    for (const [filename, content] of Object.entries(otherFiles)) {
      for (const [ruleId, check] of Object.entries(otherChecks)) {
        let match;
        const regex = new RegExp(check.regex, check.regex.flags + (check.regex.flags.includes('g') ? '' : 'g'));
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: check.message + ` Found: ${match[0].trim()}`,
            filename,
            ruleId: `ThemeCheck.BadThings.${ruleId}`,
            line,
            column
          });
        }
      }
    }

    return results;
  }
}
