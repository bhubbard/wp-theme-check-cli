import { ThemeCheck, CheckResult, FileMap } from '../types';
import { getLineAndColumn } from '../utils';

export class PluginTerritoryCheck implements ThemeCheck {
  check(phpFiles: FileMap, cssFiles: FileMap, otherFiles: FileMap): CheckResult[] {
    const results: CheckResult[] = [];

    const forbiddenFunctions = [
      'register_post_type',
      'register_taxonomy',
      'register_block_type',
      'add_role',
      'add_shortcode',
      'registerBlockType',
    ];

    const forbiddenHooks = {
      'filter': [
        'mime_types',
        'upload_mimes',
        'user_contactmethods',
      ],
    };

    const blocklist = {
      'wp_head': [
        'wp_generator',
        'feed_links',
        'feed_links_extra',
        'wp_resource_hints',
        'adjacent_posts_rel_link_wp_head',
        'wp_shortlink_wp_head',
        '_admin_bar_bump_cb',
        'rsd_link',
        'rest_output_link_wp_head',
        'wp_oembed_add_discovery_links',
        'wp_oembed_add_host_js',
        'rel_canonical',
      ],
      'template_redirect': [
        'rest_output_link_header',
        'wp_shortlink_header',
        'redirect_canonical',
      ],
    };

    for (const [filename, content] of Object.entries(phpFiles)) {
      
      for (const func of forbiddenFunctions) {
        const regex = new RegExp(`[\\s?]${func}\\s?\\(`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
          const { line, column } = getLineAndColumn(content, match.index);
          results.push({
            type: 'REQUIRED',
            message: `REQUIRED: The theme uses the ${func}() function. This is plugin-territory functionality and must not be used in themes. Use a plugin instead.`,
            filename,
            ruleId: `ThemeCheck.PluginTerritory.ForbiddenFunction.${func}`,
            line,
            column
          });
        }
      }

      for (const [type, hooks] of Object.entries(forbiddenHooks)) {
        for (const hook of hooks) {
          const regex = new RegExp(`[\\s?]add_${type}\\s*\\*\\(\\s*(['"])${hook}(['"])\\s*,`, 'g');
          let match;
          while ((match = regex.exec(content)) !== null) {
            const { line, column } = getLineAndColumn(content, match.index);
            results.push({
              type: 'REQUIRED',
              message: `REQUIRED: The theme uses the ${hook} ${type}. This is plugin-territory functionality and must not be used in themes. Use a plugin instead.`,
              filename,
              ruleId: `ThemeCheck.PluginTerritory.ForbiddenHook.${hook}`,
              line,
              column
            });
          }
        }
      }

      for (const [hook, functions] of Object.entries(blocklist)) {
        for (const func of functions) {
          const regex = new RegExp(`[\\s?]remove_action\\s*\\(\\s*(['"])${hook}(['"])\\s*,\\s*(['"])${func}(['"])`, 'g');
          let match;
          while ((match = regex.exec(content)) !== null) {
            const { line, column } = getLineAndColumn(content, match.index);
            results.push({
              type: 'REQUIRED',
              message: `REQUIRED: The theme uses remove_action ${hook} ${func}. This is plugin-territory functionality and must not be used in themes. Use a plugin instead.`,
              filename,
              ruleId: `ThemeCheck.PluginTerritory.RemoveAction.${hook}`,
              line,
              column
            });
          }
        }
      }
    }

    return results;
  }
}
