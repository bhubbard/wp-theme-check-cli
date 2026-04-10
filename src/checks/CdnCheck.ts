import { ThemeCheck, CheckResult, FileMap } from '../types';

export class CdnCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allCode = Object.values(phpFiles).join(' ') + ' ' + Object.values(cssFiles).join(' ');

    const cdnList = {
      'bootstrap-maxcdn': 'maxcdn.bootstrapcdn.com',
      'bootstrap-netdna': 'netdna.bootstrapcdn.com',
      'bootstrap-stackpath': 'stackpath.bootstrapcdn.com',
      'fontawesome': 'kit.fontawesome.com',
      'googlecode': 'googlecode.com/svn/',
      'oss.maxcdn': 'oss.maxcdn.com',
      'jquery': 'code.jquery.com/jquery-',
      'aspnetcdn': 'aspnetcdn.com',
      'cloudflare': 'cloudflare.com',
      'keycdn': 'keycdn.com',
      'pxgcdn': 'pxgcdn.com',
      'vimeocdn': 'vimeocdn.com',
    };

    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    for (const [slug, url] of Object.entries(cdnList)) {
      if (allCode.includes(url)) {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found the URL of a CDN in the code: ${url}. You should not load CSS or Javascript resources from a CDN, please bundle them with the theme.`,
          filename: targetFile,
          ruleId: `ThemeCheck.Assets.Cdn.${slug}`,
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
