import { ThemeCheck, CheckResult, FileMap } from '../types';

export class PostPaginationCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const hasNav = allPhpContent.includes('posts_nav_link');
    const hasPag = allPhpContent.includes('paginate_links');
    const hasPostsPag = allPhpContent.includes('the_posts_pagination');
    const hasPostsNav = allPhpContent.includes('the_posts_navigation');
    const hasPrevNext = allPhpContent.includes('previous_posts_link') || allPhpContent.includes('next_posts_link');

    if (!hasNav && !hasPag && !hasPostsPag && !hasPostsNav && !hasPrevNext) {
      const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: The theme doesn\'t have post pagination code in it.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Posts.MissingPagination',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
