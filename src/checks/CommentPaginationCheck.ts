import { ThemeCheck, CheckResult, FileMap } from '../types';

export class CommentPaginationCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');

    const hasPaginateLinks = allPhpContent.includes('paginate_comments_links');
    const hasNav = allPhpContent.includes('the_comments_navigation');
    const hasPag = allPhpContent.includes('the_comments_pagination');
    const hasNext = allPhpContent.includes('next_comments_link');
    const hasPrev = allPhpContent.includes('previous_comments_link');

    if (!hasPaginateLinks && !hasNav && !hasPag && !hasNext && !hasPrev) {
      const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';
      results.push({
        type: 'WARNING',
        message: 'RECOMMENDED: The theme doesn\'t have comment pagination code in it. Use paginate_comments_links() or the_comments_navigation or the_comments_pagination or next_comments_link() and previous_comments_link() to add comment pagination.',
        filename: targetFile,
        ruleId: 'ThemeCheck.Comments.MissingPagination',
        line: 1,
        column: 1
      });
    }

    return results;
  }
}
