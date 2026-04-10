import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class NonGplCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const content = Object.values(otherFiles).join(' '); // usually in readme

    const linkList: Record<string, string> = {
      'unsplash.com': 'https://unsplash.com/license',
      'pixabay': 'https://pixabay.com/service/license/',
      'freeimages': 'https://www.freeimages.com/license',
      'photopin': 'https://www.vecteezy.com/licensing-agreement',
      'vecteezy': 'https://www.vecteezy.com/licensing-agreement',
      'splitshire': 'https://www.splitshire.com/licence/',
      'freepik': 'https://www.freepikcompany.com/legal',
      'flaticon': 'https://www.freepikcompany.com/legal',
      'pikwizard': 'https://pikwizard.com/standard-license',
      'stock.adobe': 'https://stock.adobe.com/license-terms',
      'elements.envato': 'https://elements.envato.com/license-terms',
      'undraw.co': 'https://undraw.co/license',
    };

    const targetFile = Object.keys(otherFiles).find(k => k.includes('readme')) || 'readme.txt';

    for (const [slug, url] of Object.entries(linkList)) {
      if (content.toLowerCase().includes(slug.toLowerCase())) {
        results.push({
          type: 'REQUIRED',
          message: `REQUIRED: Found a reference to ${slug}. Assets from this website does not use a license that is compatible with GPL. View license: ${url}`,
          filename: targetFile,
          ruleId: 'ThemeCheck.Licensing.NonGpl',
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
