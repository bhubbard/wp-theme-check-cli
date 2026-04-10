import { ThemeCheck, CheckResult, FileMap } from '../types';

export class PostThumbnailCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');
    
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (!allPhpContent.includes('the_post_thumbnail')) {
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: No reference to the_post_thumbnail() was found in the theme. It is recommended that the theme implement this functionality instead of using custom fields for thumbnails.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Posts.MissingPostThumbnail',
        line: 1,
        column: 1
      });
    }

    if (!allPhpContent.includes('post-thumbnails')) {
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: No reference to post-thumbnails was found in the theme. If the theme has a thumbnail like functionality, it should be implemented with add_theme_support( "post-thumbnails" ) in the functions.php file.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Posts.MissingPostThumbnailSupport',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
