import { ThemeCheck, CheckResult, FileMap } from '../types';

export class CommentReplyCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];
    const allPhpContent = Object.values(phpFiles).join(' ');
    
    const targetFile = Object.keys(phpFiles).find(k => k.includes('functions.php')) || 'functions.php';

    if (!/wp_enqueue_script\(\s?("|')comment-reply("|')/i.test(allPhpContent)) {
      if (!allPhpContent.includes('comment-reply')) {
        results.push({
          type: 'WARNING',
          message: 'RECOMMENDED: Could not find the comment-reply script enqueued.',
          filename: targetFile,
          ruleId: 'ThemeCheck.Comments.MissingReplyScript',
          line: 1,
          column: 1
        });
      } else {
        results.push({
          type: 'INFO',
          message: 'INFO: Could not find the comment-reply script enqueued, however a reference to \'comment-reply\' was found. Make sure that the comment-reply script is being enqueued properly on singular pages.',
          filename: targetFile,
          ruleId: 'ThemeCheck.Comments.MalformedReplyScript',
          line: 1,
          column: 1
        });
      }
    }

    return results;
  }
}
